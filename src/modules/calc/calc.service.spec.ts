import { Test, TestingModule } from '@nestjs/testing';
import { CalcService } from './calc.service';
import { User } from '../user/user.model';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';

describe('CalcService', () => {
  let service: CalcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CalcService],
    }).compile();

    service = module.get<CalcService>(CalcService);
  });

  it('should calculate calories and BJU', () => {
    const user = {
      age: 25,
      weight: 70,
      height: 175,
      sex: 'male' as const,
    } as Partial<User>;

    const dto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    };

    const result = service.calculate(user, dto);

    expect(result).toHaveProperty('calories');
    expect(result).toHaveProperty('protein');
    expect(result).toHaveProperty('fat');
    expect(result).toHaveProperty('carbs');
    expect(result).toHaveProperty('bmr');
    expect(result).toHaveProperty('tdee');
    expect(result.calories).toBeGreaterThan(0);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.fat).toBeGreaterThan(0);
    expect(result.carbs).toBeGreaterThanOrEqual(0);
    expect(result.bmr).toBeGreaterThan(0);
    expect(result.tdee).toBeGreaterThan(0);
  });

  it('should throw error for incomplete user data', () => {
    const user = {
      age: undefined,
      weight: 70,
      height: 175,
      sex: 'male' as const,
    } as Partial<User>;

    const dto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    };

    expect(() => service.calculate(user, dto)).toThrow('Недостаточно данных пользователя для расчета');
  });

  it('should calculate different goals correctly', () => {
    const user = {
      age: 25,
      weight: 70,
      height: 175,
      sex: 'male' as const,
    } as Partial<User>;

    const maintainDto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    };

    const loseDto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'lose',
    };

    const gainDto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'gain',
    };

    const maintainResult = service.calculate(user, maintainDto);
    const loseResult = service.calculate(user, loseDto);
    const gainResult = service.calculate(user, gainDto);

    // При похудении калорий должно быть меньше
    expect(loseResult.calories).toBeLessThan(maintainResult.calories);

    // При наборе веса калорий должно быть больше
    expect(gainResult.calories).toBeGreaterThan(maintainResult.calories);

    // BMR и TDEE должны быть одинаковыми для всех целей
    expect(maintainResult.bmr).toBe(loseResult.bmr);
    expect(maintainResult.bmr).toBe(gainResult.bmr);
    expect(maintainResult.tdee).toBe(loseResult.tdee);
    expect(maintainResult.tdee).toBe(gainResult.tdee);
  });

  it('should calculate for female user correctly', () => {
    const femaleUser = {
      age: 25,
      weight: 60,
      height: 165,
      sex: 'female' as const,
    } as Partial<User>;

    const dto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    };

    const result = service.calculate(femaleUser, dto);

    expect(result).toHaveProperty('calories');
    expect(result).toHaveProperty('protein');
    expect(result).toHaveProperty('fat');
    expect(result).toHaveProperty('carbs');
    expect(result.calories).toBeGreaterThan(0);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.fat).toBeGreaterThan(0);
    expect(result.carbs).toBeGreaterThanOrEqual(0);
  });
});
