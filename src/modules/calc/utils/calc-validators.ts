export class CalcValidators {
  static validateUserData(user: any): void {
    const { age, weight, height, sex } = user;

    if (!age || age < 1 || age > 120) {
      throw new Error('Возраст должен быть от 1 до 120 лет');
    }

    if (!weight || weight < 20 || weight > 300) {
      throw new Error('Вес должен быть от 20 до 300 кг');
    }

    if (!height || height < 100 || height > 250) {
      throw new Error('Рост должен быть от 100 до 250 см');
    }

    if (!sex || !['male', 'female'].includes(sex)) {
      throw new Error('Пол должен быть "male" или "female"');
    }
  }

  static validateBodyFatPercentage(percentage: number): void {
    if (percentage < 3 || percentage > 50) {
      throw new Error('Процент жира должен быть от 3% до 50%');
    }
  }

  static validateActivityLevel(activity: string): void {
    const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    if (!validLevels.includes(activity)) {
      throw new Error('Недопустимый уровень активности');
    }
  }

  static validateGoal(goal: string): void {
    const validGoals = ['lose', 'maintain', 'gain'];
    if (!validGoals.includes(goal)) {
      throw new Error('Недопустимая цель. Доступные варианты: lose, maintain, gain');
    }
  }
}
