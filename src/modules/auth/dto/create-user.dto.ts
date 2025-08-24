import { IsString, IsEmail, MinLength, IsNumber, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'swaga-waga', description: 'Пароль, состоящий минимум из 6 символов' })
  @IsString()
  @MinLength(6)
  password: string;

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
  age?: number;

  @ApiPropertyOptional({ description: 'Вес пользователя', minimum: 0, maximum: 300 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(300)
  weight?: number;
}
