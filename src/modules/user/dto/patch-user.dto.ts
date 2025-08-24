import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class PatchUserDto {
  @ApiPropertyOptional({ example: 25, description: 'Возраст пользователя' })
  @IsOptional()
  @IsInt()
  @Min(0)
  age?: number;

  @ApiPropertyOptional({ example: 70.5, description: 'Вес пользователя (кг)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;
}
