import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user.model';

export class UserDto {
  @ApiProperty({ example: '3beeb1f1-2ec2-475e-bd38-4952f2e4235b', description: 'ID пользователя' })
  id: string;

  @ApiProperty({ example: 'user@example.com', description: 'Адрес электронной почты' })
  email: string;

  @ApiProperty({ example: 'John', description: 'Имя пользователя' })
  name: string;

  @ApiProperty({ example: 'Doe', description: 'Фамилия пользователя' })
  surname: string;

  @ApiProperty({ example: 28, nullable: true, description: 'Возраст' })
  age: number | null;

  @ApiProperty({ example: 72.5, nullable: true, description: 'Вес (кг)' })
  weight: number | null;

  @ApiProperty({ example: 180.2, nullable: true, description: 'Рост (см)' })
  height: number | null;

  @ApiProperty({ example: 'male', enum: ['male', 'female'], nullable: true, description: 'Пол' })
  sex: 'male' | 'female' | null;

  @ApiProperty({ example: '2025-09-01T12:34:56.789Z', description: 'Дата создания', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({
    example: '2025-09-10T08:15:30.000Z',
    description: 'Дата обновления',
    type: String,
    format: 'date-time',
  })
  updatedAt: Date;

  static fromEntity(user: User): UserDto {
    const { id, email, name, surname, age, weight, height, sex, createdAt, updatedAt } = user;
    return Object.assign(new UserDto(), {
      id,
      email,
      name,
      surname,
      age,
      weight,
      height,
      sex,
      createdAt,
      updatedAt,
    });
  }
}
