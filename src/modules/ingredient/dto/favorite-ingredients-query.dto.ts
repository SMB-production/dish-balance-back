import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FavoriteIngredientsQueryDto {
  @ApiProperty({
    description: 'Размер страницы',
    default: 10,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive({ message: 'Page size must be positive' })
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size must not exceed 100' })
  pageSize?: number = 10;

  @ApiProperty({
    description: 'Номер страницы',
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsPositive({ message: 'Page must be positive' })
  @Min(1, { message: 'Page must be at least 1' })
  page?: number = 1;
}
