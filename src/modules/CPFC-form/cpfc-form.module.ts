import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CPFCFormModel } from './cpfc-form.model';
import { CPFCFormService } from './cpfc-form.service';
import { CPFCFormController } from './cpfc-form.controller';

@Module({
  providers: [CPFCFormService],
  imports: [SequelizeModule.forFeature([CPFCFormModel])],
  controllers: [CPFCFormController],
  exports: [CPFCFormService],
})
export class CPFCFormModule {}
