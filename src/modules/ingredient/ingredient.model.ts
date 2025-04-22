import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.model';
import { CreateIngredient } from './interfaces/create-ingredient.interface';

@Table({ tableName: 'ingredients' })
export class IngredientModel extends Model<IngredientModel, CreateIngredient> {
  @ApiProperty()
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, allowNull: false })
  id: string;

  @ApiProperty()
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  caloriesPer100g: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  proteinPer100g: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  fatPer100g: number;

  @ApiProperty()
  @Column({ type: DataType.INTEGER, allowNull: false })
  carbohydratesPer100g: number;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
