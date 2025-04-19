import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 1, description: 'ID пользователя' })
  id: number;
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  email: string;
}
