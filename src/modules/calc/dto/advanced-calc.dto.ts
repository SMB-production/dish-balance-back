import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class AdvancedCalcDto {
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
  userType?: 'regular' | 'athlete';
}
