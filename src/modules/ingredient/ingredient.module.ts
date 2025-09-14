import { Module } from '@nestjs/common';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { IngredientModel } from './ingredient.model';
import { FavoriteIngredientModel } from './favorite-ingredient.model';

@Module({
  controllers: [IngredientController],
  providers: [IngredientService],
  exports: [IngredientService],
  imports: [SequelizeModule.forFeature([IngredientModel, FavoriteIngredientModel])],
})
export class IngredientModule {}
