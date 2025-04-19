import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CPFCFormService } from './cpfc-form.service';
import { CPFCFormModel } from './cpfc-form.model';
import { CalculateDPFCDishes } from './dto/calculate-DPFC-dishes';

@ApiTags('Главная форма рассчета КБЖУ')
@Controller('cpfc')
export class CPFCFormController {
  constructor(private CPFCFormService: CPFCFormService) {}

  @ApiOperation({ summary: 'Рассчет КБЖУ блюда' })
  @ApiResponse({ status: 200, type: CPFCFormModel })
  @Post()
  calculateCPFCDishes(@Body() dishDTO: CalculateDPFCDishes) {
    return this.CPFCFormService.calculateCPFCDishes(dishDTO);
  }
}
