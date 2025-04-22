import { Injectable, NotFoundException } from '@nestjs/common';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { IngredientModel } from './ingredient.model';
import { CreateIngredient } from './interfaces/create-ingredient.interface';
import { EditIngredientDto } from './dto/edit-ingredient.dto';

@Injectable()
export class IngredientService {
  constructor(@InjectModel(IngredientModel) private ingredientRepository: typeof IngredientModel) {}

  async getAllIngredients(userId: string): Promise<IngredientModel[]> {
    const ingredients = await this.ingredientRepository.findAll({ where: { userId } });
    return ingredients.sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  async getIngredientById(id: string, userId: string): Promise<IngredientModel> {
    const ingredient = await this.ingredientRepository.findOne({ where: { id, userId } });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  }

  async addIngredient(addIngredientDto: AddIngredientDto, userId: string) {
    const result: CreateIngredient = {
      ...addIngredientDto,
      userId,
    };
    return await this.ingredientRepository.create(result);
  }

  async editIngredient(ingredientDto: EditIngredientDto, userId: string) {
    const affectedRows = await this.ingredientRepository.update(
      { ...ingredientDto },
      {
        where: { id: ingredientDto.id, userId },
      },
    );

    if (affectedRows[0] === 0) {
      throw new NotFoundException('Ingredient not found');
    }

    return ingredientDto;
  }

  async deleteIngredient(id: string, userId: string): Promise<string> {
    const affectedRows = await this.ingredientRepository.destroy({ where: { id, userId } });
    if (affectedRows === 0) {
      throw new NotFoundException('Ingredient not found');
    }
    return id;
  }
}
