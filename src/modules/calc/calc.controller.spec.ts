import { Test, TestingModule } from '@nestjs/testing';
import { CalcController } from './calc.controller';
import { CalcService } from './calc.service';
import { AdvancedCalcService } from './advanced-calc.service';
import { User } from '../user/user.model';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';

describe('CalcController', () => {
  let controller: CalcController;
  let service: CalcService;
  let advancedService: AdvancedCalcService;

  const mockUser = {
    age: 25,
    weight: 70,
    height: 175,
    sex: 'male',
  } as Partial<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalcController],
      providers: [
        {
          provide: CalcService,
          useValue: {
            calculate: jest.fn(),
          },
        },
        {
          provide: AdvancedCalcService,
          useValue: {
            calculateAdvanced: jest.fn(),
            calculateForAthletes: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CalcController>(CalcController);
    service = module.get<CalcService>(CalcService);
    advancedService = module.get<AdvancedCalcService>(AdvancedCalcService);
  });

  it('POST /calc/nutrition', async () => {
    const dto: CalcNutritionDto = { activity: ActivityLevel.MODERATE, goal: 'maintain' };
    const expected = {
      calories: 2600,
      protein: 98,
      fat: 70,
      carbs: 360,
      bmr: 1700,
      tdee: 2600,
    };

    (service.calculate as jest.Mock).mockReturnValue(expected);

    const result = await controller.calculateNutrition(dto, mockUser as User);

    expect(service.calculate).toHaveBeenCalledWith(mockUser, dto);
    expect(result).toEqual(expected);
  });

  it('POST /calc/advanced', async () => {
    const dto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain' as const,
      userType: 'regular' as const,
    };
    const expected = {
      calories: 2600,
      protein: 98,
      fat: 70,
      carbs: 360,
      bmr: 1700,
      tdee: 2600,
      bmi: 22.9,
      bmiCategory: 'Нормальный вес',
      idealWeight: { min: 65, max: 79 },
      waterIntake: 2.5,
      fiber: 36,
    };

    (advancedService.calculateAdvanced as jest.Mock).mockReturnValue(expected);

    const result = await controller.calculateAdvanced(dto, mockUser as User);

    expect(advancedService.calculateAdvanced).toHaveBeenCalledWith(mockUser, {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    });
    expect(result).toEqual(expected);
  });

  it('POST /calc/advanced for athlete', async () => {
    const dto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain' as const,
      userType: 'athlete' as const,
      bodyFatPercentage: 12,
    };
    const expected = {
      calories: 2600,
      protein: 120,
      fat: 70,
      carbs: 360,
      bmr: 1700,
      tdee: 2600,
      bmi: 22.9,
      bmiCategory: 'Нормальный вес',
      idealWeight: { min: 65, max: 79 },
      waterIntake: 2.5,
      fiber: 36,
    };

    (advancedService.calculateForAthletes as jest.Mock).mockReturnValue(expected);

    const result = await controller.calculateAdvanced(dto, mockUser as User);

    expect(advancedService.calculateForAthletes).toHaveBeenCalledWith(
      mockUser,
      { activity: ActivityLevel.MODERATE, goal: 'maintain' },
      12,
    );
    expect(result).toEqual(expected);
  });

  it('POST /calc/bmi', async () => {
    const expected = {
      bmi: 22.9,
      bmiCategory: 'Нормальный вес',
      idealWeight: { min: 65, max: 79 },
      currentWeight: 70,
      height: 175,
    };

    (advancedService.calculateAdvanced as jest.Mock).mockReturnValue({
      bmi: 22.9,
      bmiCategory: 'Нормальный вес',
      idealWeight: { min: 65, max: 79 },
    });

    const result = await controller.calculateBMI(mockUser as User);

    expect(advancedService.calculateAdvanced).toHaveBeenCalledWith(mockUser, {
      activity: 'moderate',
      goal: 'maintain',
    });
    expect(result).toEqual(expected);
  });
});
