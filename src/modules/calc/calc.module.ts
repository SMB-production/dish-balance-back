import { Module } from '@nestjs/common';
import { CalcController } from './calc.controller';
import { CalcService } from './calc.service';
import { AdvancedCalcService } from './advanced-calc.service';

@Module({
  controllers: [CalcController],
  providers: [CalcService, AdvancedCalcService],
  exports: [CalcService, AdvancedCalcService],
})
export class CalcModule {}
