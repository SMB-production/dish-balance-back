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
      sex: 'male',
    } as User;

    const dto: CalcNutritionDto = {
      activity: ActivityLevel.MODERATE,
      goal: 'maintain',
    };

    const result = service.calculate(user, dto);

    expect(result).toHaveProperty('calories');
    expect(result).toHaveProperty('protein');
    expect(result).toHaveProperty('fat');
    expect(result).toHaveProperty('carbs');
    expect(result.calories).toBeGreaterThan(0);
    expect(result.protein).toBeGreaterThan(0);
    expect(result.fat).toBeGreaterThan(0);
    expect(result.carbs).toBeGreaterThan(0);
  });
});
