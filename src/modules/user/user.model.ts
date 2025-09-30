import { Column, DataType, Model, PrimaryKey, Table, Unique, CreatedAt, UpdatedAt } from 'sequelize-typescript';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true, allowNull: false })
  id: string;

  @Unique
  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.STRING)
  surname: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  age: number | null;

  @Column({ type: DataType.FLOAT, allowNull: true })
  weight: number | null;

  @Column({ type: DataType.FLOAT, allowNull: true })
  height: number | null;

  @Column({
    type: DataType.ENUM('male', 'female'),
    allowNull: true,
  })
  sex: 'male' | 'female' | null;

  @CreatedAt
  @Column({ type: DataType.DATE })
  createdAt: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE })
  updatedAt: Date;
}
