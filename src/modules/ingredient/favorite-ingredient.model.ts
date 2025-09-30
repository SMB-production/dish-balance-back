import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { IngredientModel } from './ingredient.model';

@Table({
  tableName: 'favorite_ingredients',
  indexes: [
    {
      unique: true,
      fields: ['userId', 'ingredientId'],
    },
  ],
})
export class FavoriteIngredientModel extends Model {
  @ApiProperty()
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, allowNull: false })
  id: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false })
  userId: string;

  @ForeignKey(() => IngredientModel)
  @Column({ type: DataType.UUID, allowNull: false })
  ingredientId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => IngredientModel)
  ingredient: IngredientModel;

  @ApiProperty()
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt: Date;

  @ApiProperty()
  @Column({ type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt: Date;
}
