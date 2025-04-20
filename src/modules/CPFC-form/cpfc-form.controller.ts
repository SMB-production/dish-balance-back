import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CPFCFormService } from './cpfc-form.service';
import { CPFCFormModel } from './cpfc-form.model';
import { CalculateDPFCDishes } from './dto/calculate-DPFC-dishes';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('Главная форма рассчета КБЖУ')
@Controller('cpfc')
export class CPFCFormController {
  constructor(private CPFCFormService: CPFCFormService) {}

  @ApiOperation({ summary: 'Получение всех рассчетов по пользователю' })
  @ApiResponse({ status: 200, type: [CPFCFormModel] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCPFCDishes(@Req() req: Request) {
    if (!req?.user?.id) {
      throw new Error('User not found');
    }
    return this.CPFCFormService.getCPFCDishesByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Рассчет КБЖУ блюда' })
  @ApiResponse({ status: 200, type: CPFCFormModel })
  @Post()
  calculateCPFCDishes(@Body() dishDTO: CalculateDPFCDishes, @Req() req: Request) {
    const userID = req?.user?.id;
    return this.CPFCFormService.calculateCPFCDishes(dishDTO, userID);
  }
}
