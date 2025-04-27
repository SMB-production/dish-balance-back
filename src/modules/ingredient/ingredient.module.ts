import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { IngredientModel } from './ingredient.model';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService],
  imports: [SequelizeModule.forFeature([IngredientModel])],
})
export class IngredientModule {}
