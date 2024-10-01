import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsInt, IsObject, IsOptional, Min } from 'class-validator';

export class PaginationResultMeta {
  @Expose()
  totalItems: number;

  @Expose()
  itemCount: number;

  @Expose()
  itemsPerPage: number;

  @Expose()
  totalPages: number;

  @Expose()
  currentPage: number;
}

export class PaginationResult<T> {
  @Expose()
  @Type(() => Object) // Generic type handling for items
  items: T[];

  @Expose()
  @Type(() => PaginationResultMeta) // Type handling for meta
  meta: PaginationResultMeta;
}

export class PaginationDto {
  @ApiProperty({ description: 'Page number', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: 'Limit of items per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    description: 'Filters for the query',
    required: false,
    type: Object,
  })
  @IsOptional()
  @IsObject()
  filter?: Record<string, any>; // Allow any filter criteria dynamically

  @ApiProperty({
    description: 'Sorting criteria',
    example: { name: 1 },
    required: false,
  })
  @IsOptional()
  @IsObject()
  sort?: Record<string, any>; // Sorting logic
}
