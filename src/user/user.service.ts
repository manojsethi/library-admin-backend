// src/user/user.service.ts
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import mongoose, { Model } from 'mongoose';
import { User } from 'src/models/user.schema';
import { PaginationDto, PaginationResult } from 'src/shared/pagination.dto';
import { PaginationService } from 'src/shared/pagination.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly paginationService: PaginationService,
  ) {}
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
  async paginate(
    paginationDto: PaginationDto,
  ): Promise<PaginationResult<UserDto>> {
    const existingFilters = paginationDto.filter || {};

    // Append a filter to exclude users with the "admin" role
    const appendedFilters = {
      ...existingFilters,
      roles: { $nin: ['admin'] },
    };
    paginationDto.filter = appendedFilters;
    return this.paginationService.paginate<User, UserDto>(
      this.userModel,
      paginationDto,
      UserDto, // Pass the DTO class
    );
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const result = await this.userModel.findByIdAndDelete(
      new mongoose.Types.ObjectId(id),
    );

    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'User deleted successfully' };
  }
}
