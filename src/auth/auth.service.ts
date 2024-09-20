// src/auth/auth.service.ts
import {
  ConflictException,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User } from '../models/user.schema';
import { RegisterUserDto } from './dto/register-user.dto';
import { RefreshTokenService } from './refresh-token.service';

@Injectable()
export class AuthService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async onModuleInit() {
    await this.seedAdminUser();
  }

  private async seedAdminUser() {
    // Check if an admin user already exists
    const adminExists = await this.userModel.exists({
      roles: { $in: ['admin'] },
    });
    if (adminExists) {
      console.log('Admin user already exists, skipping seeding.');
      return;
    }

    // Create the admin user
    const adminPassword = 'Welcome12@#'; // Use env variable or a default
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = new this.userModel({
      name: 'Manoj',
      email: 'admin@admin.com', // Set a default or fetch from env
      password: hashedPassword,
      phone: '9876543210',
      roles: ['admin'],
    });

    await adminUser.save();
    console.log('Admin user seeded successfully.');
  }

  async registerUser(createUserDto: RegisterUserDto): Promise<User> {
    const { email, password, name, phone } = createUserDto;

    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      name,
      phone,
      roles: ['tenant', 'tenant-admin'], // Default role
      isActive: true, // Default status
    });

    // Save the user to the database
    return await newUser.save();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async validateUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId).lean();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async login(user: User): Promise<{
    accessToken: string;
    refreshToken: string;
    email: string;
    roles: string[];
    name: string;
  }> {
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles,
      name: user.name,
    };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = await this.generateRefreshToken(user._id.toString());

    return {
      accessToken,
      refreshToken,
      email: user.email,
      roles: user.roles,
      name: user.name,
    };
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { sub: userId },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );

    await this.refreshTokenService.saveRefreshToken(userId, refreshToken); // Save the refresh token in the database with device info

    return refreshToken;
  }

  async refresh(refreshToken: string): Promise<{ accessToken: string }> {
    // Validate the refresh token
    const { sub: userId } = this.jwtService.verify(refreshToken, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    // Validate the refresh token along with device/session info
    const isValid = await this.refreshTokenService.validateRefreshToken(
      userId,
      refreshToken,
    );
    if (!isValid) {
      throw new Error('Invalid refresh token');
    }

    // Generate a new access token
    const user = await this.validateUserById(userId); // Fetch user data from your user service/repository
    const payload = {
      email: user.email,
      sub: user._id,
      roles: user.roles,
      name: user.name,
    };

    return { accessToken: this.jwtService.sign(payload) };
  }
}
