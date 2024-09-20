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
import { RolesGuard } from 'src/passport/role.gaurd';
import { Roles } from '../decorators/roles.decorator';
import { Tenant } from '../models/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { TenantService } from './tenant.service';

@ApiTags('Tenants')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(['admin', 'tenant'])
@Controller('tenants')
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: 201,
    description: 'Tenant created successfully',
    type: Tenant,
  })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() createTenantDto: CreateTenantDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser('_id') userId: string,
  ): Promise<Tenant> {
    return this.tenantService.createTenant(createTenantDto, file, userId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all tenants' })
  @ApiResponse({ status: 200, description: 'List of tenants', type: [Tenant] })
  async findAll(): Promise<Tenant[]> {
    return this.tenantService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a tenant by ID' })
  @ApiResponse({ status: 200, description: 'Tenant found', type: Tenant })
  @ApiResponse({ status: 404, description: 'Tenant not found' })
  async findOne(@Param('id') id: string): Promise<Tenant> {
    return this.tenantService.findById(id);
  }
}
