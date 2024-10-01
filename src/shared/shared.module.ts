// src/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { NameGeneratorService } from './name-generator.service';
import { PaginationService } from './pagination.service';
import { UploadService } from './upload.service';

@Global()
@Module({
  providers: [UploadService, NameGeneratorService, PaginationService],
  exports: [UploadService, NameGeneratorService, PaginationService],
})
export class SharedModule {}
