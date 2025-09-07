export const CALC_CONSTANTS = {
  // Калорийность макронутриентов (ккал/г)
  MACRO_CALORIES: {
    PROTEIN: 4,
    CARBS: 4,
    FAT: 9,
    ALCOHOL: 7,
  },

  // Коэффициенты активности (Harris-Benedict)
  ACTIVITY_MULTIPLIERS: {
    SEDENTARY: 1.2, // Минимальная активность
    LIGHT: 1.375, // Легкая активность (1-3 дня в неделю)
    MODERATE: 1.55, // Умеренная активность (3-5 дней в неделю)
    ACTIVE: 1.725, // Высокая активность (6-7 дней в неделю)
    VERY_ACTIVE: 1.9, // Очень высокая активность (2 раза в день)
  },

  // Нормы макронутриентов (г/кг веса)
  MACRO_RATIOS: {
    PROTEIN: {
      MIN: 1.2,
      MAX: 2.0,
      DEFAULT: 1.4,
    },
    FAT: {
      MIN: 0.8,
      MAX: 1.2,
      DEFAULT: 1.0,
    },
  },

  // BMI категории
  BMI_CATEGORIES: {
    UNDERWEIGHT: { min: 0, max: 18.5, label: 'Недостаточный вес' },
    NORMAL: { min: 18.5, max: 25, label: 'Нормальный вес' },
    OVERWEIGHT: { min: 25, max: 30, label: 'Избыточный вес' },
    OBESE: { min: 30, max: Infinity, label: 'Ожирение' },
  },

  // Рекомендации по потреблению воды (мл/кг веса)
  WATER_INTAKE: {
    MIN: 30,
    MAX: 40,
    DEFAULT: 35,
  },

  // Рекомендации по потреблению клетчатки (г/1000 ккал)
  FIBER_INTAKE: {
    MIN: 10,
    MAX: 20,
    DEFAULT: 14,
  },

  // Дефицит/профицит калорий (% от TDEE)
  CALORIE_ADJUSTMENT: {
    LOSE: 0.15, // 15% дефицит
    MAINTAIN: 0, // Без изменений
    GAIN: 0.15, // 15% профицит
  },
} as const;
