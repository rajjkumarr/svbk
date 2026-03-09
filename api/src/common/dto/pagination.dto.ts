import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Reusable pagination query DTO.
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
