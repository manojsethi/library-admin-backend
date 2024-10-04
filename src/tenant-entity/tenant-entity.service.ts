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
import { PaginationDto, PaginationResult } from 'src/shared/pagination.dto';
import { PaginationService } from 'src/shared/pagination.service';
import { UploadService } from 'src/shared/upload.service';
import { TenantEntityConnectionService } from 'src/tenant-connection.service';
import { UserService } from 'src/user/user.service';
import { TenantEntity } from '../models/tenant-entity.schema';
import { CreateTenantEntityDto } from './dto/create-tenant-entity.dto';
import { TenantEntityDto } from './dto/tenant-entity.dto';

@Injectable()
export class TenantEntityService {
  constructor(
    @InjectModel(TenantEntity.name)
    private tenantEntityModel: Model<TenantEntity>,
    private userService: UserService, // Inject AuthService
    private readonly paginationService: PaginationService,
    private readonly uploadService: UploadService, // Inject UploadService
    private readonly tenantEntityConnectionService: TenantEntityConnectionService,
    private readonly nameGenerator: NameGeneratorService, // Inject NameGeneratorService
  ) {}

  async createTenantEntity(
    createTenantDto: CreateTenantEntityDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<TenantEntity> {
    const user = await this.userService.getUser(userId);
    if (!user) throw new NotFoundException('User not found.');
    const userTenantsCount = await this.tenantEntityModel.countDocuments({
      users: userId,
    });

    if (userTenantsCount >= 5) {
      throw new ForbiddenException('You can have a maximum of 5 libraries.');
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

    const newTenant = new this.tenantEntityModel({
      ...createTenantDto,
      logo: logoUrl,
      dbName,
      subdomain,
      users: [userId],
      creator: userId, // Add user reference
      isActive: false, // Initially inactive until subdomain is set
      isPublished: true,
    });

    const tenantConnection =
      await this.tenantEntityConnectionService.getTenantConnection(dbName);

    // Create a user model for this tenant's DB connection
    const userModel = tenantConnection.model<User>('User', UserSchema);

    // Register the user in the tenant's database

    await newTenant.save();
    const newUser = new userModel(user);
    await newUser.save();
    return newTenant;
  }

  async updateSubdomain(
    tenantId: string,
    subdomain: string,
  ): Promise<TenantEntity> {
    // Check if subdomain is already taken
    const existingTenant = await this.tenantEntityModel.findOne({ subdomain });
    if (existingTenant) {
      throw new BadRequestException('Subdomain is already taken.');
    }

    // Update tenant with the new subdomain and mark as active
    return this.tenantEntityModel.findByIdAndUpdate(
      tenantId,
      { subdomain, isActive: true },
      { new: true },
    );
  }

  async findAll(): Promise<TenantEntity[]> {
    return this.tenantEntityModel.find().exec();
  }

  async paginate(
    paginationDto: PaginationDto,
    user: User,
  ): Promise<PaginationResult<TenantEntityDto>> {
    return this.paginationService.paginate<TenantEntity, TenantEntityDto>(
      this.tenantEntityModel,
      paginationDto,
      TenantEntityDto, // Pass the DTO class
    );
  }

  async findById(id: string): Promise<TenantEntity> {
    const tenant = await this.tenantEntityModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }
}
