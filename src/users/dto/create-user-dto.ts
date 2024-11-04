import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  readonly email: string;
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  readonly password: string;
}
