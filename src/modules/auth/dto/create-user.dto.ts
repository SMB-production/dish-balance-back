import { IsString, IsEmail, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'swaga-waga', description: 'Пароль, состоящий минимум из 6 символов' })
  @IsString()
  @MinLength(6)
  password: string;
}
