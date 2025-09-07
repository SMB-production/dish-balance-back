import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CalcService } from './calc.service';
import { AdvancedCalcService } from './advanced-calc.service';
import { CalcNutritionDto } from './dto/calc-nutrition.dto';
import { AdvancedCalcDto } from './dto/advanced-calc.dto';
import { HybridAdvancedCalcDto, HybridBMIDto, HybridCalcDto } from './dto/hybrid-calc.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../user/user.model';

@ApiTags('Расчет КБЖУ')
@Controller('calc')
export class CalcController {
  constructor(
    private calcService: CalcService,
    private advancedCalcService: AdvancedCalcService,
  ) {}

  @ApiOperation({ summary: 'Расчет нормы КБЖУ (гибридный) - данные из тела запроса или JWT токена' })
  @ApiResponse({ status: 200, description: 'Возвращает базовые расчеты КБЖУ' })
  @Post('nutrition')
  async calculateNutrition(@Body() dto: HybridCalcDto, @CurrentUser() user?: User) {
    // Извлекаем данные пользователя: сначала из тела запроса, потом из JWT токена
    const userData = {
      age: dto.age || user?.age,
      weight: dto.weight || user?.weight,
      height: dto.height || user?.height,
      sex: dto.sex || user?.sex,
    };

    // Удаляем данные пользователя из DTO, оставляя только activity и goal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { age, weight, height, sex, ...calcDto } = dto;

    return this.calcService.calculate(userData, calcDto);
  }

  @ApiOperation({ summary: 'Расчет нормы КБЖУ (публичный) - с данными в теле запроса' })
  @ApiResponse({ status: 200, description: 'Возвращает базовые расчеты КБЖУ' })
  @Post('nutrition/public')
  async calculateNutritionPublic(
    @Body() dto: CalcNutritionDto & { age: number; weight: number; height: number; sex: 'male' | 'female' },
  ) {
    const { age, weight, height, sex, ...calcDto } = dto;
    const user = { age, weight, height, sex };
    return this.calcService.calculate(user, calcDto);
  }

  @ApiOperation({ summary: 'Расширенный расчет КБЖУ (гибридный) - данные из тела запроса или JWT токена' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает расширенные расчеты включая BMI, идеальный вес, потребление воды и клетчатки',
  })
  @Post('advanced')
  async calculateAdvanced(@Body() dto: HybridAdvancedCalcDto, @CurrentUser() user?: User) {
    // Извлекаем данные пользователя: сначала из тела запроса, потом из JWT токена
    const userData = {
      age: dto.age || user?.age,
      weight: dto.weight || user?.weight,
      height: dto.height || user?.height,
      sex: dto.sex || user?.sex,
    };

    // Удаляем данные пользователя из DTO
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { age, weight, height, sex, bodyFatPercentage, userType, ...calcDto } = dto;

    if (userType === 'athlete' && bodyFatPercentage) {
      return this.advancedCalcService.calculateForAthletes(userData, calcDto, bodyFatPercentage);
    }

    return this.advancedCalcService.calculateAdvanced(userData, calcDto);
  }

  @ApiOperation({ summary: 'Расширенный расчет КБЖУ (публичный) - с данными в теле запроса' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает расширенные расчеты включая BMI, идеальный вес, потребление воды и клетчатки',
  })
  @Post('advanced/public')
  async calculateAdvancedPublic(
    @Body()
    dto: CalcNutritionDto & AdvancedCalcDto & { age: number; weight: number; height: number; sex: 'male' | 'female' },
  ) {
    const { age, weight, height, sex, bodyFatPercentage, userType, ...calcDto } = dto;
    const user = { age, weight, height, sex };

    if (userType === 'athlete' && bodyFatPercentage) {
      return this.advancedCalcService.calculateForAthletes(user, calcDto, bodyFatPercentage);
    }

    return this.advancedCalcService.calculateAdvanced(user, calcDto);
  }

  @ApiOperation({ summary: 'Расчет только BMI и идеального веса (гибридный) - данные из тела запроса или JWT токена' })
  @ApiResponse({ status: 200, description: 'Возвращает BMI и диапазон идеального веса' })
  @Post('bmi')
  async calculateBMI(@Body() dto?: HybridBMIDto, @CurrentUser() user?: User) {
    // Извлекаем данные пользователя: сначала из тела запроса, потом из JWT токена
    const userData = {
      age: 25, // Используем возраст по умолчанию для BMI
      weight: dto?.weight || user?.weight,
      height: dto?.height || user?.height,
      sex: dto?.sex || user?.sex,
    };

    const result = this.advancedCalcService.calculateAdvanced(userData, {
      activity: 'moderate' as any,
      goal: 'maintain' as any,
    });

    return {
      bmi: result.bmi,
      bmiCategory: result.bmiCategory,
      idealWeight: result.idealWeight,
      currentWeight: userData.weight,
      height: userData.height,
    };
  }

  @ApiOperation({ summary: 'Расчет только BMI и идеального веса (публичный) - с данными в теле запроса' })
  @ApiResponse({ status: 200, description: 'Возвращает BMI и диапазон идеального веса' })
  @Post('bmi/public')
  async calculateBMIPublic(@Body() dto: { weight: number; height: number; sex: 'male' | 'female' }) {
    const { weight, height, sex } = dto;
    const user = { age: 25, weight, height, sex }; // Используем возраст по умолчанию для BMI

    const result = this.advancedCalcService.calculateAdvanced(user, {
      activity: 'moderate' as any,
      goal: 'maintain' as any,
    });

    return {
      bmi: result.bmi,
      bmiCategory: result.bmiCategory,
      idealWeight: result.idealWeight,
      currentWeight: weight,
      height: height,
    };
  }
}
