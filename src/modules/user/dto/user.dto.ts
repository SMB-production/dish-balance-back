import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: '3beeb1f1-2ec2-475e-bd38-4952f2e4235b', description: 'ID пользователя' })
  id: string;
  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  email: string;
}
