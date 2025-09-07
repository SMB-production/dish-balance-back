import { Injectable, BadRequestException } from '@nestjs/common';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';
import { User } from '../user/user.model';

@Injectable()
export class CalcService {
  calculate(user: Partial<User>, dto: CalcNutritionDto) {
    const { age, weight, height, sex } = user;
    const { activity, goal } = dto;

    // Валидация входных данных
    if (!age || !weight || !height || !sex) {
      throw new BadRequestException('Недостаточно данных пользователя для расчета. Требуются: возраст, вес, рост, пол');
    }

    // Дополнительная валидация значений
    if (age < 1 || age > 120) {
      throw new BadRequestException('Возраст должен быть от 1 до 120 лет');
    }
    if (weight < 20 || weight > 300) {
      throw new BadRequestException('Вес должен быть от 20 до 300 кг');
    }
    if (height < 100 || height > 250) {
      throw new BadRequestException('Рост должен быть от 100 до 250 см');
    }
    if (!['male', 'female'].includes(sex)) {
      throw new BadRequestException('Пол должен быть "male" или "female"');
    }

    // Формула Миффлина-Сан Жеора (исправленная)
    const bmr =
      sex === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;

    // Исправленные коэффициенты активности (по стандарту Harris-Benedict)
    const activityMultipliers = {
      [ActivityLevel.SEDENTARY]: 1.2, // Минимальная активность
      [ActivityLevel.LIGHT]: 1.375, // Легкая активность (1-3 дня в неделю)
      [ActivityLevel.MODERATE]: 1.55, // Умеренная активность (3-5 дней в неделю)
      [ActivityLevel.ACTIVE]: 1.725, // Высокая активность (6-7 дней в неделю)
      [ActivityLevel.VERY_ACTIVE]: 1.9, // Очень высокая активность (2 раза в день)
    };

    const tdee = bmr * activityMultipliers[activity];

    // Корректировка калорий в зависимости от цели
    let calories = tdee;
    const deficitSurplus = Math.round(tdee * 0.15); // 15% от TDEE для более точного расчета

    if (goal === 'lose') calories -= deficitSurplus;
    if (goal === 'gain') calories += deficitSurplus;

    // Исправленный расчет макронутриентов
    // Белки: 1.2-1.6 г на кг веса (берем 1.4 для баланса)
    const protein = weight * 1.4;
    // Жиры: 0.8-1.2 г на кг веса (берем 1.0)
    const fat = weight;

    // Углеводы: оставшиеся калории после белков и жиров
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;

    // Проверяем, что углеводы не отрицательные
    const carbs = Math.max(0, remainingCalories / 4);

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
    };
  }
}
