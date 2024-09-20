// src/tenant/tenant.service.ts
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserSchema } from 'src/models/user.schema';
import { NameGeneratorService } from 'src/shared/name-generator.service';
import { UploadService } from 'src/shared/upload.service';
import { TenantConnectionService } from 'src/tenant-connection.service';
import { AuthService } from '../auth/auth.service'; // Import AuthService
import { Tenant } from '../models/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
    private authService: AuthService, // Inject AuthService
    private readonly uploadService: UploadService, // Inject UploadService
    private readonly tenantConnectionService: TenantConnectionService,
    private readonly nameGenerator: NameGeneratorService, // Inject NameGeneratorService
  ) {}

  async createTenant(
    createTenantDto: CreateTenantDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<Tenant> {
    // Check if user already has 5 libraries

    const userTenantsCount = await this.tenantModel.countDocuments({
      users: createTenantDto.userId,
    });

    if (userTenantsCount >= 2) {
      throw new ForbiddenException('You can have a maximum of 2 libraries.');
    }

    // Randomly assign a temporary subdomain
    const subdomain = this.nameGenerator.generateRandomSubdomain();
    const dbName = this.nameGenerator.generateRandomDbName();

    // Upload logo if file is provided
    let logoUrl = '';
    // if (file) {
    //   const folderPath = `tenants/${userId}`; // Dynamic folder path based on user ID
    //   logoUrl = await this.uploadService.uploadFile(file, folderPath);
    // }
    logoUrl = '';

    // Create a new tenant
    const newUserId = createTenantDto.userId;
    delete createTenantDto.userId;
    const newTenant = new this.tenantModel({
      ...createTenantDto,
      logo: logoUrl,
      dbName,
      subdomain,
      users: [newUserId],
      creator: userId, // Add user reference
      isActive: false, // Initially inactive until subdomain is set
      isPublished: true,
    });

    const tenantConnection =
      await this.tenantConnectionService.getTenantConnection(dbName);

    // Create a user model for this tenant's DB connection
    const userModel = tenantConnection.model<User>('User', UserSchema);

    // Register the user in the tenant's database

    await newTenant.save();
    const newUser = new userModel({
      name: createTenantDto.name,
      password: 'Welcome12@#',
      email: createTenantDto.contact.email,
      phone: createTenantDto.contact.phone,
    });
    await newUser.save();
    return newTenant;
  }

  async updateSubdomain(tenantId: string, subdomain: string): Promise<Tenant> {
    // Check if subdomain is already taken
    const existingTenant = await this.tenantModel.findOne({ subdomain });
    if (existingTenant) {
      throw new BadRequestException('Subdomain is already taken.');
    }

    // Update tenant with the new subdomain and mark as active
    return this.tenantModel.findByIdAndUpdate(
      tenantId,
      { subdomain, isActive: true },
      { new: true },
    );
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }
}
