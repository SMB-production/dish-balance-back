import { Test, TestingModule } from '@nestjs/testing';
import { CalcController } from './calc.controller';
import { CalcService } from './calc.service';
import { User } from '../user/user.model';
import { CalcNutritionDto, ActivityLevel } from './dto/calc-nutrition.dto';

describe('CalcController', () => {
  let controller: CalcController;
  let service: CalcService;

  const mockUser = {
    age: 25,
    weight: 70,
    height: 175,
    sex: 'male',
  } as User;

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
      ],
    }).compile();

    controller = module.get<CalcController>(CalcController);
    service = module.get<CalcService>(CalcService);
  });

  it('POST /calc/nutrition', async () => {
    const dto: CalcNutritionDto = { activity: ActivityLevel.MODERATE, goal: 'maintain' };
    const expected = { calories: 2600, protein: 126, fat: 63, carbs: 360 };

    (service.calculate as jest.Mock).mockReturnValue(expected);

    const result = await controller.calculateNutrition(dto, mockUser);

    expect(service.calculate).toHaveBeenCalledWith(mockUser, dto);
    expect(result).toEqual(expected);
  });
});
