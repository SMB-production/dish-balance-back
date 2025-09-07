import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../user/user.model';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';

export interface AdvancedCalcResult {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  bmr: number;
  tdee: number;
  bmi: number;
  bmiCategory: string;
  idealWeight: {
    min: number;
    max: number;
  };
  waterIntake: number; // в литрах
  fiber: number; // в граммах
}

@Injectable()
export class AdvancedCalcService {
  calculateAdvanced(user: Partial<User>, dto: CalcNutritionDto): AdvancedCalcResult {
    const { age, weight, height, sex } = user;
    const { activity, goal } = dto;

    // Валидация
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

    // BMR по формуле Миффлина-Сан Жеора
    const bmr =
      sex === 'male' ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;

    // Альтернативная формула Харриса-Бенедикта (для сравнения)
    const bmrHarris =
      sex === 'male'
        ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
        : 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;

    // Используем среднее значение для большей точности
    const bmrAverage = (bmr + bmrHarris) / 2;

    // Коэффициенты активности
    const activityMultipliers = {
      [ActivityLevel.SEDENTARY]: 1.2,
      [ActivityLevel.LIGHT]: 1.375,
      [ActivityLevel.MODERATE]: 1.55,
      [ActivityLevel.ACTIVE]: 1.725,
      [ActivityLevel.VERY_ACTIVE]: 1.9,
    };

    const tdee = bmrAverage * activityMultipliers[activity];

    // Корректировка калорий
    let calories = tdee;
    const deficitSurplus = Math.round(tdee * 0.15);

    if (goal === 'lose') calories -= deficitSurplus;
    if (goal === 'gain') calories += deficitSurplus;

    // Расчет макронутриентов
    const protein = weight * 1.4;
    const fat = weight;
    const proteinCalories = protein * 4;
    const fatCalories = fat * 9;
    const remainingCalories = calories - proteinCalories - fatCalories;
    const carbs = Math.max(0, remainingCalories / 4);

    // BMI и категория
    const bmi = weight / Math.pow(height / 100, 2);
    const bmiCategory = this.getBMICategory(bmi);

    // Идеальный вес (диапазон)
    const idealWeight = this.calculateIdealWeight(height, sex);

    // Рекомендуемое потребление воды (35мл на кг веса)
    const waterIntake = (weight * 35) / 1000;

    // Рекомендуемое потребление клетчатки (14г на 1000 калорий)
    const fiber = Math.round((calories / 1000) * 14);

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      fat: Math.round(fat),
      carbs: Math.round(carbs),
      bmr: Math.round(bmrAverage),
      tdee: Math.round(tdee),
      bmi: Math.round(bmi * 10) / 10,
      bmiCategory,
      idealWeight,
      waterIntake: Math.round(waterIntake * 10) / 10,
      fiber,
    };
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Недостаточный вес';
    if (bmi < 25) return 'Нормальный вес';
    if (bmi < 30) return 'Избыточный вес';
    return 'Ожирение';
  }

  private calculateIdealWeight(height: number, sex: 'male' | 'female'): { min: number; max: number } {
    // Формула Девина
    const baseWeight = sex === 'male' ? 50 + 2.3 * (height / 2.54 - 60) : 45.5 + 2.3 * (height / 2.54 - 60);

    return {
      min: Math.round(baseWeight * 0.9),
      max: Math.round(baseWeight * 1.1),
    };
  }

  // Расчет для спортсменов (учитывает мышечную массу)
  calculateForAthletes(user: Partial<User>, dto: CalcNutritionDto, bodyFatPercentage?: number): AdvancedCalcResult {
    const result = this.calculateAdvanced(user, dto);

    if (bodyFatPercentage && user.weight) {
      // Корректировка для спортсменов с учетом % жира
      const leanBodyMass = user.weight * (1 - bodyFatPercentage / 100);
      const adjustedProtein = leanBodyMass * 2.0; // 2г на кг сухой массы

      result.protein = Math.round(adjustedProtein);

      // Пересчет углеводов
      const proteinCalories = result.protein * 4;
      const fatCalories = result.fat * 9;
      const remainingCalories = result.calories - proteinCalories - fatCalories;
      result.carbs = Math.max(0, Math.round(remainingCalories / 4));
    }

    return result;
  }
}
