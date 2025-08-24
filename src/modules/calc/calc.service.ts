import { Injectable } from '@nestjs/common';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';
import { User } from '../user/user.model';

@Injectable()
export class CalcService {
  calculate(user: User, dto: CalcNutritionDto) {
    const { age, weight, height, sex } = user;
    const { activity, goal } = dto;

    // Формула Миффлина-Сан Жеора
    const bmr =
      sex === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;

    const activityMultipliers = {
      [ActivityLevel.SEDENTARY]: 1.2,
      [ActivityLevel.LIGHT]: 1.375,
      [ActivityLevel.MODERATE]: 1.55,
      [ActivityLevel.ACTIVE]: 1.725,
      [ActivityLevel.VERY_ACTIVE]: 1.9,
    };

    const tdee = bmr * activityMultipliers[activity];

    let calories = tdee;
    if (goal === 'lose') calories -= 300;
    if (goal === 'gain') calories += 300;

    const protein = weight * 1.8;
    const fat = weight * 0.9;
    const carbs = (calories - (protein * 4 + fat * 9)) / 4;

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
    };
  }
}
