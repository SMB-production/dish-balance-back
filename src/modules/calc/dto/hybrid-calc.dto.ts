import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsEnum, Min, Max } from 'class-validator';
import { CalcNutritionDto } from './calc-nutrition.dto';

export class HybridCalcDto extends CalcNutritionDto {
  @ApiProperty({
    example: 25,
    description: 'Возраст (опционально, если есть в JWT токене)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(120)
  age?: number;

  @ApiProperty({
    example: 70,
    description: 'Вес в кг (опционально, если есть в JWT токене)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weight?: number;

  @ApiProperty({
    example: 175,
    description: 'Рост в см (опционально, если есть в JWT токене)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiProperty({
    example: 'male',
    description: 'Пол (опционально, если есть в JWT токене)',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  sex?: 'male' | 'female';
}

export class HybridAdvancedCalcDto extends HybridCalcDto {
  @ApiProperty({
    example: 15,
    description: 'Процент жира в организме (опционально, для спортсменов)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(50)
  bodyFatPercentage?: number;

  @ApiProperty({
    example: 'athlete',
    description: 'Тип пользователя: обычный или спортсмен',
    enum: ['regular', 'athlete'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['regular', 'athlete'])
  userType?: 'regular' | 'athlete';
}

export class HybridBMIDto {
  @ApiProperty({
    example: 70,
    description: 'Вес в кг (опционально, если есть в JWT токене)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(20)
  @Max(300)
  weight?: number;

  @ApiProperty({
    example: 175,
    description: 'Рост в см (опционально, если есть в JWT токене)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(250)
  height?: number;

  @ApiProperty({
    example: 'male',
    description: 'Пол (опционально, если есть в JWT токене)',
    enum: ['male', 'female'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['male', 'female'])
  sex?: 'male' | 'female';
}
