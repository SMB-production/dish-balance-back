import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'swaga-waga', description: 'Пароль' })
  @IsString()
  password: string;
}
