// src/shared/shared.module.ts
import { Global, Module } from '@nestjs/common';
import { NameGeneratorService } from './name-generator.service';
import { UploadService } from './upload.service';

@Global()
@Module({
  providers: [UploadService, NameGeneratorService],
  exports: [UploadService, NameGeneratorService],
})
export class SharedModule {}
