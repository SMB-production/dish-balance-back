import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class EditUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsInt()
  @Min(1)
  age?: number;

  @ApiPropertyOptional({ example: 70.5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  weight?: number;

  @ApiPropertyOptional({ example: 175 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  height?: number;

  @ApiPropertyOptional({ example: 'male', enum: ['male', 'female'] })
  @IsOptional()
  @IsEnum(['male', 'female'])
  sex?: 'male' | 'female';
}
