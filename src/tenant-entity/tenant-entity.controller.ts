// src/tenant/tenant.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { TenantEntity } from 'src/models/tenant-entity.schema';
import { User } from 'src/models/user.schema';
import { RolesGuard } from 'src/passport/role.gaurd';
import { PaginationDto, PaginationResult } from 'src/shared/pagination.dto';
import { Roles } from '../decorators/roles.decorator';
import { CreateTenantEntityDto } from './dto/create-tenant-entity.dto';
import { TenantEntityDto } from './dto/tenant-entity.dto';
import { TenantEntityService } from './tenant-entity.service';

@ApiTags('Tenant Entity')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(['admin', 'tenant', 'tenant-admin'])
@Controller('tenant-entities')
export class TenantEntityController {
  constructor(private readonly tenantEntityService: TenantEntityService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: 201,
    description: 'Tenant created successfully',
    type: TenantEntity,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createTenantDto: CreateTenantEntityDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('_id') userId: string,
  ): Promise<TenantEntity> {
    return this.tenantEntityService.createTenantEntity(
      createTenantDto,
      file,
      userId,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tenants' })
  @ApiResponse({
    status: 200,
    description: 'List of tenants',
    type: [TenantEntity],
  })
  async findAll(): Promise<TenantEntity[]> {
    return this.tenantEntityService.findAll();
  }

  @Post('all')
  @ApiOperation({
    summary: 'Retrieve Tenant Entities with pagination and filters',
  })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getTenantEntities(
    @Body() paginationDto: PaginationDto,
    @CurrentUser() user: User,
  ): Promise<PaginationResult<TenantEntityDto>> {
    const data = await this.tenantEntityService.paginate(paginationDto, user);
    return data;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found', type: TenantEntity })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantEntityService.findById(id);
  }
}
