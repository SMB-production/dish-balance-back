import { ApiProperty } from '@nestjs/swagger';

export class AuthStatusDto {
  @ApiProperty({
    description: 'Статус авторизации пользователя',
    example: true,
  })
  isAuthenticated: boolean;

  @ApiProperty({
    description: 'Время истечения токена в формате ISO string',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  tokenExpiresAt?: string;

  @ApiProperty({
    description: 'Оставшееся время до истечения токена в миллисекундах',
    example: 3600000,
    required: false,
  })
  tokenExpiresIn?: number;

  @ApiProperty({
    description: 'ID пользователя, если авторизован',
    example: 'user123',
    required: false,
  })
  userId?: string;

  @ApiProperty({
    description: 'Email пользователя, если авторизован',
    example: 'user@example.com',
    required: false,
  })
  userEmail?: string;
}
