import { Injectable, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CPFCFormModel } from './cpfc-form.model';
import { CalculateDPFCDishes } from './dto/calculate-DPFC-dishes';
import { TotalCPFC } from './dto/ingredients';

@Injectable()
export class CPFCFormService {
  constructor(@InjectModel(CPFCFormModel) private CPFCRepository: typeof CPFCFormModel) {}

  @Post()
  async calculateCPFCDishes(dto: CalculateDPFCDishes) {
    const totalWeight = dto.ingredients.reduce((acc, { weight }) => acc + weight, 0);
    const totalIngredientsValues: TotalCPFC[] = dto.ingredients.map(
      ({ carbohydratesPer100g, fatPer100g, proteinPer100g, caloriesPer100g, weight }) => ({
        weight,
        carbohydrates: carbohydratesPer100g * weight,
        fat: fatPer100g * weight,
        calories: caloriesPer100g * weight,
        protein: proteinPer100g * weight,
      }),
    );

    const totalDishValues: TotalCPFC = totalIngredientsValues.reduce<TotalCPFC>(
      (acc, ingredient) => {
        return {
          ...acc,
          fat: acc.fat + ingredient.fat,
          calories: acc.calories + ingredient.calories,
          protein: acc.protein + ingredient.protein,
          carbohydrates: acc.carbohydrates + ingredient.carbohydrates,
        };
      },
      {
        fat: 0,
        calories: 0,
        carbohydrates: 0,
        protein: 0,
        weight: totalWeight,
      },
    );

    const dishCPFC: TotalCPFC = {
      fat: this.roundToTwo(totalDishValues.fat / totalWeight),
      protein: this.roundToTwo(totalDishValues.protein / totalWeight),
      calories: this.roundToTwo(totalDishValues.calories / totalWeight),
      carbohydrates: this.roundToTwo(totalDishValues.carbohydrates / totalWeight),
      weight: totalWeight,
    };
    try {
      const result = {
        name: dto.name,
        ingredients: dto.ingredients,
        cpfc: dishCPFC,
      };
      await this.CPFCRepository.create(result);
      return result;
    } catch (error) {
      return error;
    }
  }

  private roundToTwo(num: number): number {
    return Number(num.toFixed(2));
  }
}
