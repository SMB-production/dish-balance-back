import { Test, TestingModule } from '@nestjs/testing';
import { IngredientController } from './ingredient.controller';
import { IngredientService } from './ingredient.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AddFavoriteIngredientDto } from './dto/add-favorite-ingredient.dto';
import { RemoveFavoriteIngredientDto } from './dto/remove-favorite-ingredient.dto';
import { FavoriteIngredientsQueryDto } from './dto/favorite-ingredients-query.dto';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { IngredientModel } from './ingredient.model';
import { FavoriteIngredientModel } from './favorite-ingredient.model';
import { FavoriteIngredientsResponseDto } from './dto/favorite-ingredients-response.dto';

describe('IngredientController - Favorites', () => {
  let controller: IngredientController;
  let service: IngredientService;

  const mockUser: UserPayload = {
    id: 'user-id',
    email: 'test@example.com',
  };

  const mockIngredient = {
    id: 'ingredient-id',
    name: 'Test Ingredient',
    caloriesPer100g: 100,
    proteinPer100g: 10,
    fatPer100g: 5,
    carbohydratesPer100g: 15,
    userId: 'user-id',
  } as IngredientModel;

  const mockFavoriteIngredient = {
    id: 'favorite-id',
    userId: 'user-id',
    ingredientId: 'ingredient-id',
    ingredient: mockIngredient,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as FavoriteIngredientModel;

  const mockFavoriteIngredientsResponse = {
    ingredients: [mockIngredient],
    totalCount: 25,
    pageSize: 10,
    page: 1,
    totalPages: 3,
  } as FavoriteIngredientsResponseDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngredientController],
      providers: [
        {
          provide: IngredientService,
          useValue: {
            addToFavorites: jest.fn(),
            removeFromFavorites: jest.fn(),
            getFavoriteIngredients: jest.fn(),
            getFavoriteIngredientById: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<IngredientController>(IngredientController);
    service = module.get<IngredientService>(IngredientService);
  });

  describe('addToFavorites', () => {
    it('should add ingredient to favorites', async () => {
      const addFavoriteDto: AddFavoriteIngredientDto = { ingredientId: 'ingredient-id' };

      jest.spyOn(service, 'addToFavorites').mockResolvedValue(mockFavoriteIngredient);

      const result = await controller.addToFavorites(addFavoriteDto, mockUser);

      expect(service.addToFavorites).toHaveBeenCalledWith(addFavoriteDto, mockUser.id);
      expect(result).toEqual(mockFavoriteIngredient);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove ingredient from favorites', async () => {
      const removeFavoriteDto: RemoveFavoriteIngredientDto = { ingredientId: 'ingredient-id' };

      jest.spyOn(service, 'removeFromFavorites').mockResolvedValue('ingredient-id');

      const result = await controller.removeFromFavorites(removeFavoriteDto, mockUser);

      expect(service.removeFromFavorites).toHaveBeenCalledWith(removeFavoriteDto, mockUser.id);
      expect(result).toBe('ingredient-id');
    });
  });

  describe('getFavoriteIngredients', () => {
    it('should return paginated favorite ingredients', async () => {
      const query: FavoriteIngredientsQueryDto = { pageSize: 10, page: 1 };

      jest.spyOn(service, 'getFavoriteIngredients').mockResolvedValue(mockFavoriteIngredientsResponse);

      const result = await controller.getFavoriteIngredients(query, mockUser);

      expect(service.getFavoriteIngredients).toHaveBeenCalledWith(query, mockUser.id);
      expect(result).toEqual(mockFavoriteIngredientsResponse);
    });

    it('should use default query parameters', async () => {
      const query: FavoriteIngredientsQueryDto = {};

      jest.spyOn(service, 'getFavoriteIngredients').mockResolvedValue(mockFavoriteIngredientsResponse);

      await controller.getFavoriteIngredients(query, mockUser);

      expect(service.getFavoriteIngredients).toHaveBeenCalledWith(query, mockUser.id);
    });
  });

  describe('getFavoriteIngredientById', () => {
    it('should return favorite ingredient by id', async () => {
      const ingredientId = 'ingredient-id';

      jest.spyOn(service, 'getFavoriteIngredientById').mockResolvedValue(mockIngredient);

      const result = await controller.getFavoriteIngredientById(ingredientId, mockUser);

      expect(service.getFavoriteIngredientById).toHaveBeenCalledWith(ingredientId, mockUser.id);
      expect(result).toEqual(mockIngredient);
    });
  });
});
