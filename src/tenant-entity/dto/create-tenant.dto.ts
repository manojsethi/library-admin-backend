// src/tenants/dto/create-tenant.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class AddressDto {
  @ApiProperty({ description: 'Street address of the tenant' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'City of the tenant' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State of the tenant' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Country of the tenant' })
  @IsString()
  @IsNotEmpty()
  country: string;
}

export class ContactDto {
  @ApiProperty({ description: 'Contact phone number of the tenant' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Contact email address of the tenant' })
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class CreateTenantDto {
  @ApiProperty({ description: 'Name of the tenant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Name of the library associated with the tenant',
  })
  @IsString()
  @IsNotEmpty()
  libraryName: string;

  @ApiProperty({
    description: 'User for whom this library is created',
  })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Address of the tenant', type: AddressDto })
  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ApiProperty({
    description: 'Contact information of the tenant',
    type: ContactDto,
  })
  @ValidateNested()
  @Type(() => ContactDto)
  contact: ContactDto;

  @ApiPropertyOptional({
    description: 'Logo image file for the tenant',
    type: 'string',
    format: 'binary',
  })
  logo: Express.Multer.File; // Logo will be uploaded as a file
}
