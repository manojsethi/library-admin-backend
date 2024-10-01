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
import { RolesGuard } from 'src/passport/role.gaurd';
import { Roles } from '../decorators/roles.decorator';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantEntityService } from './tenant-entity.service';

@ApiTags('Entity')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(['admin', 'tenant'])
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
    @Body() createTenantDto: CreateTenantDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('_id') userId: string,
  ): Promise<TenantEntity> {
    return this.tenantEntityService.createTenant(createTenantDto, file, userId);
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

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found', type: TenantEntity })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string): Promise<TenantEntity> {
    return this.tenantEntityService.findById(id);
  }
}
