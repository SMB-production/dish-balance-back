import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserDto {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  readonly id: number;
}
