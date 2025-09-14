import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Access токен для авторизации',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh токен для обновления access токена',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'Время истечения access токена в формате ISO string',
    example: '2024-01-15T14:30:00.000Z',
  })
  accessTokenExpiresAt: string;

  @ApiProperty({
    description: 'Время истечения refresh токена в формате ISO string',
    example: '2024-01-17T10:30:00.000Z',
  })
  refreshTokenExpiresAt: string;

  @ApiProperty({
    description: 'Оставшееся время до истечения access токена в миллисекундах',
    example: 14400000,
  })
  accessTokenExpiresIn: number;

  @ApiProperty({
    description: 'Оставшееся время до истечения refresh токена в миллисекундах',
    example: 172800000,
  })
  refreshTokenExpiresIn: number;
}
