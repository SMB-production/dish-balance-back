import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, Min } from 'class-validator';

export enum ActivityLevel {
  SEDENTARY = 'sedentary', // минимальная активность
  LIGHT = 'light', // лёгкая активность (1-3 тренировки в неделю)
  MODERATE = 'moderate', // средняя (3-5 тренировки в неделю)
  ACTIVE = 'active', // высокая (6-7 раз в неделю)
  VERY_ACTIVE = 'very_active', // очень высокая (спорт, физ.работа)
}

export class CalcNutritionDto {
  @ApiProperty({ example: 25, description: 'Возраст' })
  @IsInt()
  @Min(1)
  age?: number;

  @ApiProperty({ example: 70, description: 'Вес (кг)' })
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiProperty({ example: 175, description: 'Рост (см)' })
  @IsNumber()
  @Min(1)
  height?: number;

  @ApiProperty({ example: 'male', enum: ['male', 'female'], description: 'Пол' })
  sex?: 'male' | 'female';

  @ApiProperty({ example: 'moderate', enum: ActivityLevel, description: 'Уровень активности' })
  @IsEnum(ActivityLevel)
  activity: ActivityLevel;

  @ApiProperty({
    example: 'maintain',
    enum: ['lose', 'maintain', 'gain'],
    description: 'Цель: похудение / поддержание / набор массы',
  })
  goal: 'lose' | 'maintain' | 'gain';
}
