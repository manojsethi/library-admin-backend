// src/tenant/tenant.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { SharedModule } from 'src/shared/shared.module';
import { TenantConnectionService } from 'src/tenant-connection.service';
import { Tenant, TenantSchema } from '../models/tenant.schema';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tenant.name, schema: TenantSchema }]),
    AuthModule,
    SharedModule,
  ],
  controllers: [TenantController],
  providers: [TenantService, TenantConnectionService],
})
export class TenantModule {}
