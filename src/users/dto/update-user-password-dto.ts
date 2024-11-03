import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({example: '1', description: 'Уникальный идентификатор'})
  readonly id: number;
  @ApiProperty({example: 'qwerty', description: 'Пароль'})
  readonly password: string;
}
