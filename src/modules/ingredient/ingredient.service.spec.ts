import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/sequelize';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { IngredientModel } from './ingredient.model';
import { FavoriteIngredientModel } from './favorite-ingredient.model';
import { AddFavoriteIngredientDto } from './dto/add-favorite-ingredient.dto';
import { RemoveFavoriteIngredientDto } from './dto/remove-favorite-ingredient.dto';
import { FavoriteIngredientsQueryDto } from './dto/favorite-ingredients-query.dto';

describe('IngredientService - Favorites', () => {
  let service: IngredientService;
  let ingredientRepository: any;
  let favoriteIngredientRepository: any;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngredientService,
        {
          provide: getModelToken(IngredientModel),
          useValue: {
            findByPk: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            destroy: jest.fn(),
          },
        },
        {
          provide: getModelToken(FavoriteIngredientModel),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            destroy: jest.fn(),
            findAndCountAll: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<IngredientService>(IngredientService);
    ingredientRepository = module.get(getModelToken(IngredientModel));
    favoriteIngredientRepository = module.get(getModelToken(FavoriteIngredientModel));
  });

  describe('addToFavorites', () => {
    it('should add ingredient to favorites successfully', async () => {
      const addFavoriteDto: AddFavoriteIngredientDto = { ingredientId: 'ingredient-id' };
      const userId = 'user-id';

      ingredientRepository.findByPk.mockResolvedValue(mockIngredient);
      favoriteIngredientRepository.findOne.mockResolvedValue(null);
      favoriteIngredientRepository.create.mockResolvedValue(mockFavoriteIngredient);

      const result = await service.addToFavorites(addFavoriteDto, userId);

      expect(ingredientRepository.findByPk).toHaveBeenCalledWith('ingredient-id');
      expect(favoriteIngredientRepository.findOne).toHaveBeenCalledWith({
        where: { userId, ingredientId: 'ingredient-id' },
      });
      expect(favoriteIngredientRepository.create).toHaveBeenCalledWith({
        userId,
        ingredientId: 'ingredient-id',
      });
      expect(result).toEqual(mockFavoriteIngredient);
    });

    it('should throw NotFoundException when ingredient does not exist', async () => {
      const addFavoriteDto: AddFavoriteIngredientDto = { ingredientId: 'non-existent-id' };
      const userId = 'user-id';

      ingredientRepository.findByPk.mockResolvedValue(null);

      await expect(service.addToFavorites(addFavoriteDto, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when ingredient is already in favorites', async () => {
      const addFavoriteDto: AddFavoriteIngredientDto = { ingredientId: 'ingredient-id' };
      const userId = 'user-id';

      ingredientRepository.findByPk.mockResolvedValue(mockIngredient);
      favoriteIngredientRepository.findOne.mockResolvedValue(mockFavoriteIngredient);

      await expect(service.addToFavorites(addFavoriteDto, userId)).rejects.toThrow(ConflictException);
    });
  });

  describe('removeFromFavorites', () => {
    it('should remove ingredient from favorites successfully', async () => {
      const removeFavoriteDto: RemoveFavoriteIngredientDto = { ingredientId: 'ingredient-id' };
      const userId = 'user-id';

      favoriteIngredientRepository.destroy.mockResolvedValue(1);

      const result = await service.removeFromFavorites(removeFavoriteDto, userId);

      expect(favoriteIngredientRepository.destroy).toHaveBeenCalledWith({
        where: { userId, ingredientId: 'ingredient-id' },
      });
      expect(result).toBe('ingredient-id');
    });

    it('should throw NotFoundException when favorite ingredient does not exist', async () => {
      const removeFavoriteDto: RemoveFavoriteIngredientDto = { ingredientId: 'ingredient-id' };
      const userId = 'user-id';

      favoriteIngredientRepository.destroy.mockResolvedValue(0);

      await expect(service.removeFromFavorites(removeFavoriteDto, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFavoriteIngredients', () => {
    it('should return paginated favorite ingredients', async () => {
      const query: FavoriteIngredientsQueryDto = { pageSize: 10, page: 1 };
      const userId = 'user-id';

      const mockResult = {
        count: 25,
        rows: [mockFavoriteIngredient],
      };

      favoriteIngredientRepository.findAndCountAll.mockResolvedValue(mockResult);

      const result = await service.getFavoriteIngredients(query, userId);

      expect(favoriteIngredientRepository.findAndCountAll).toHaveBeenCalledWith({
        where: { userId },
        include: [{ model: IngredientModel, as: 'ingredient' }],
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });

      expect(result).toEqual({
        ingredients: [mockIngredient],
        totalCount: 25,
        pageSize: 10,
        page: 1,
        totalPages: 3,
      });
    });

    it('should use default pagination values', async () => {
      const query: FavoriteIngredientsQueryDto = {};
      const userId = 'user-id';

      const mockResult = { count: 5, rows: [] };
      favoriteIngredientRepository.findAndCountAll.mockResolvedValue(mockResult);

      await service.getFavoriteIngredients(query, userId);

      expect(favoriteIngredientRepository.findAndCountAll).toHaveBeenCalledWith({
        where: { userId },
        include: [{ model: IngredientModel, as: 'ingredient' }],
        limit: 10,
        offset: 0,
        order: [['createdAt', 'DESC']],
      });
    });
  });

  describe('getFavoriteIngredientById', () => {
    it('should return favorite ingredient by id', async () => {
      const ingredientId = 'ingredient-id';
      const userId = 'user-id';

      favoriteIngredientRepository.findOne.mockResolvedValue(mockFavoriteIngredient);

      const result = await service.getFavoriteIngredientById(ingredientId, userId);

      expect(favoriteIngredientRepository.findOne).toHaveBeenCalledWith({
        where: { userId, ingredientId },
        include: [{ model: IngredientModel, as: 'ingredient' }],
      });
      expect(result).toEqual(mockIngredient);
    });

    it('should throw NotFoundException when favorite ingredient not found', async () => {
      const ingredientId = 'non-existent-id';
      const userId = 'user-id';

      favoriteIngredientRepository.findOne.mockResolvedValue(null);

      await expect(service.getFavoriteIngredientById(ingredientId, userId)).rejects.toThrow(NotFoundException);
    });
  });
});
