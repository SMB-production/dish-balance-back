import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { InjectModel } from '@nestjs/sequelize';
import { IngredientModel } from './ingredient.model';
import { CreateIngredient } from './interfaces/create-ingredient.interface';
import { EditIngredientDto } from './dto/edit-ingredient.dto';
import { FavoriteIngredientModel } from './favorite-ingredient.model';
import { AddFavoriteIngredientDto } from './dto/add-favorite-ingredient.dto';
import { RemoveFavoriteIngredientDto } from './dto/remove-favorite-ingredient.dto';
import { FavoriteIngredientsQueryDto } from './dto/favorite-ingredients-query.dto';
import { FavoriteIngredientsResponseDto } from './dto/favorite-ingredients-response.dto';

@Injectable()
export class IngredientService {
  constructor(
    @InjectModel(IngredientModel) private ingredientRepository: typeof IngredientModel,
    @InjectModel(FavoriteIngredientModel) private favoriteIngredientRepository: typeof FavoriteIngredientModel,
  ) {}

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

  async addToFavorites(addFavoriteDto: AddFavoriteIngredientDto, userId: string): Promise<FavoriteIngredientModel> {
    const ingredient = await this.ingredientRepository.findByPk(addFavoriteDto.ingredientId);
    if (!ingredient) {
      throw new NotFoundException('Ingredient not found');
    }

    const existingFavorite = await this.favoriteIngredientRepository.findOne({
      where: { userId, ingredientId: addFavoriteDto.ingredientId },
    });

    if (existingFavorite) {
      throw new ConflictException('Ingredient already in favorites');
    }

    return await this.favoriteIngredientRepository.create({
      userId,
      ingredientId: addFavoriteDto.ingredientId,
    });
  }

  async removeFromFavorites(removeFavoriteDto: RemoveFavoriteIngredientDto, userId: string): Promise<string> {
    const affectedRows = await this.favoriteIngredientRepository.destroy({
      where: { userId, ingredientId: removeFavoriteDto.ingredientId },
    });

    if (affectedRows === 0) {
      throw new NotFoundException('Favorite ingredient not found');
    }

    return removeFavoriteDto.ingredientId;
  }

  async getFavoriteIngredients(
    query: FavoriteIngredientsQueryDto,
    userId: string,
  ): Promise<FavoriteIngredientsResponseDto> {
    const { pageSize = 10, page = 1 } = query;
    const offset = (page - 1) * pageSize;

    const { count, rows } = await this.favoriteIngredientRepository.findAndCountAll({
      where: { userId },
      include: [
        {
          model: IngredientModel,
          as: 'ingredient',
        },
      ],
      limit: pageSize,
      offset,
      order: [['createdAt', 'DESC']],
    });

    const totalPages = Math.ceil(count / pageSize);

    return {
      ingredients: rows.map((favorite) => favorite.ingredient),
      totalCount: count,
      pageSize,
      page,
      totalPages,
    };
  }

  async getFavoriteIngredientById(ingredientId: string, userId: string): Promise<IngredientModel> {
    const favorite = await this.favoriteIngredientRepository.findOne({
      where: { userId, ingredientId },
      include: [
        {
          model: IngredientModel,
          as: 'ingredient',
        },
      ],
    });

    if (!favorite) {
      throw new NotFoundException('Favorite ingredient not found');
    }

    return favorite.ingredient;
  }
}
