import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { PaginationDto, PaginationResult } from './pagination.dto';

@Injectable()
export class PaginationService {
  async paginate<T, K>(
    model: Model<T>,
    paginationDto: PaginationDto,
    dto: new () => K, // Accept the DTO class as an argument
  ): Promise<PaginationResult<K>> {
    const { page, limit, filter, sort } = paginationDto;

    const query = model.find(filter || {}); // Apply dynamic filters
    const totalItems = await model.countDocuments(filter || {}); // Get total count

    const dynamicSort = sort || {};

    if (!dynamicSort.createdAt) {
      dynamicSort.createdAt = -1;
    }
    const items = await query
      .sort(dynamicSort) // Apply sorting
      .skip((page - 1) * limit) // Pagination logic
      .limit(limit)
      .lean(); // Use lean() to get plain JS objects

    const itemCount = items.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Transform plain JS objects into instances of the DTO
    const transformedItems = plainToInstance(dto, items, {
      excludeExtraneousValues: true, // This ensures @Expose() works correctly
    });

    return {
      items: transformedItems as K[], // Return the transformed items as K[]
      meta: {
        totalItems,
        itemCount,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }
}
