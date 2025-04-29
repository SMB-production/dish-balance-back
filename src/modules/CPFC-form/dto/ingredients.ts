import { IsString, Min } from 'class-validator';
import { IsNotEmptyNumberDecorator } from '../../../common/decorators/is-not-empty-number.decorator';

export interface IIngredient {
  name: string;
  weight: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbohydratesPer100g: number;
}

export class Ingredient implements IIngredient {
  @IsString()
  name: string;
  @IsNotEmptyNumberDecorator()
  @Min(0, { message: 'Value must be positive or zero' })
  weight: number;
  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  caloriesPer100g: number;
  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  proteinPer100g: number;
  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  fatPer100g: number;
  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  carbohydratesPer100g: number;
}

export interface TotalCPFC {
  weight: number;
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}
