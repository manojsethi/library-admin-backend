// src/tenant/tenant.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import {
  TenantEntity,
  TenantEntitySchema,
} from 'src/models/tenant-entity.schema';
import { SharedModule } from 'src/shared/shared.module';
import { TenantEntityConnectionService } from 'src/tenant-connection.service';
import { UserModule } from 'src/user/user.module';
import { TenantEntityController } from './tenant-entity.controller';
import { TenantEntityService } from './tenant-entity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TenantEntity.name, schema: TenantEntitySchema },
    ]),
    AuthModule,
    SharedModule,
    UserModule,
  ],
  controllers: [TenantEntityController],
  providers: [TenantEntityService, TenantEntityConnectionService],
})
export class TenantEntityModule {}
