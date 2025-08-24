import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CalcService } from './calc.service';
import { CalcNutritionDto } from './dto/calc-nutrition.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { User } from '../user/user.model';

@ApiTags('Расчет КБЖУ')
@Controller('calc')
export class CalcController {
  constructor(private calcService: CalcService) {}

  @ApiOperation({ summary: 'Расчет нормы КБЖУ (по данным пользователя)' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('nutrition')
  async calculateNutrition(@Body() dto: CalcNutritionDto, @CurrentUser() user: User) {
    return this.calcService.calculate(user, dto);
  }
}
