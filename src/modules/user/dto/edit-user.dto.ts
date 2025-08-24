import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiPropertyOptional({ description: 'Возраст пользователя', minimum: 0, maximum: 150 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;

  @ApiPropertyOptional({ description: 'Вес пользователя', minimum: 0, maximum: 300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(300)
  weight?: number;
}
