import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Ingredients, TotalCPFC } from './dto/ingredients';
import { User } from '../user/user.model';

interface CPFCForm {
  name: string;
  cpfc: TotalCPFC;
  ingredients: Ingredients[];
}

@Table({ tableName: 'dishСPFC' })
export class CPFCFormModel extends Model<CPFCFormModel, CPFCForm> {
  @ApiProperty({ example: '3beeb1f1-2ec2-475e-bd38-4952f2e4235b', description: 'Уникальный идентификатор' })
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, allowNull: false })
  id: string;

  @ApiProperty({ example: 'Салат', description: 'Название блюда' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({
    example: {
      weight: 200,
      caloriesPer100g: 18,
      proteinPer100g: 0.9,
      fatPer100g: 0.2,
      carbohydratesPer100g: 3.9,
    },
    description: 'Итоговое значение КБЖУ блюда',
    type: 'object',
    properties: {
      weight: { type: 'number' },
      caloriesPer100g: { type: 'number' },
      proteinPer100g: { type: 'number' },
      fatPer100g: { type: 'number' },
      carbohydratesPer100g: { type: 'number' },
    },
  })
  @Column({ type: DataType.JSON, allowNull: false })
  cpfc: TotalCPFC;

  @ApiProperty({
    example: [
      {
        name: 'Помидор',
        weight: 200,
        caloriesPer100g: 18,
        proteinPer100g: 0.9,
        fatPer100g: 0.2,
        carbohydratesPer100g: 3.9,
      },
    ],
    description: 'Список ингредиентов с их пищевой ценностью',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        weight: { type: 'number' },
        caloriesPer100g: { type: 'number' },
        proteinPer100g: { type: 'number' },
        fatPer100g: { type: 'number' },
        carbohydratesPer100g: { type: 'number' },
      },
    },
  })
  @Column({ type: DataType.JSON, allowNull: false })
  ingredients: Ingredients[];

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
