import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { IngredientService } from './ingredient.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { IngredientModel } from './ingredient.model';
import { DeleteIngredientDto } from './dto/delete-ingredient.dto';
import { EditIngredientDto } from './dto/edit-ingredient.dto';
import { AddFavoriteIngredientDto } from './dto/add-favorite-ingredient.dto';
import { RemoveFavoriteIngredientDto } from './dto/remove-favorite-ingredient.dto';
import { FavoriteIngredientsQueryDto } from './dto/favorite-ingredients-query.dto';
import { FavoriteIngredientsResponseDto } from './dto/favorite-ingredients-response.dto';
import { FavoriteIngredientModel } from './favorite-ingredient.model';

@ApiTags('Контроллер ингредиентов')
@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @ApiOperation({ summary: 'Получение всех ингредиентов пользователя' })
  @ApiResponse({ status: 200, type: [IngredientModel] })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllIngredients(@CurrentUser() user: UserPayload) {
    return this.ingredientService.getAllIngredients(user.id);
  }

  @ApiOperation({ summary: 'Получение ингредиента по ID' })
  @ApiResponse({ status: 200, type: IngredientModel })
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getIngredientById(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.ingredientService.getIngredientById(id, user.id);
  }

  @ApiOperation({ summary: 'Добавление ингредиента' })
  @ApiResponse({ status: 200, type: IngredientModel })
  @UseGuards(JwtAuthGuard)
  @Post()
  addIngredient(@Body() addIngredientDto: AddIngredientDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.addIngredient(addIngredientDto, user.id);
  }

  @ApiOperation({ summary: 'Редактирование ингредиента' })
  @ApiResponse({ status: 200, type: IngredientModel })
  @UseGuards(JwtAuthGuard)
  @Put()
  editIngredient(@Body() ingredientDto: EditIngredientDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.editIngredient(ingredientDto, user.id);
  }

  @ApiOperation({ summary: 'Удаление ингредиента' })
  @ApiResponse({ status: 200, type: String })
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteIngredient(@Body() ingredientDto: DeleteIngredientDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.deleteIngredient(ingredientDto.id, user.id);
  }

  @ApiOperation({ summary: 'Добавление ингредиента в избранное' })
  @ApiResponse({
    status: 201,
    description: 'Ингредиент успешно добавлен в избранное',
    type: FavoriteIngredientModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Ингредиент не найден',
  })
  @ApiResponse({
    status: 409,
    description: 'Ингредиент уже в избранном',
  })
  @UseGuards(JwtAuthGuard)
  @Post('favorites')
  addToFavorites(@Body() addFavoriteDto: AddFavoriteIngredientDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.addToFavorites(addFavoriteDto, user.id);
  }

  @ApiOperation({ summary: 'Удаление ингредиента из избранного' })
  @ApiResponse({
    status: 200,
    description: 'Ингредиент успешно удален из избранного',
    type: String,
  })
  @ApiResponse({
    status: 404,
    description: 'Ингредиент не найден в избранном',
  })
  @UseGuards(JwtAuthGuard)
  @Delete('favorites')
  removeFromFavorites(@Body() removeFavoriteDto: RemoveFavoriteIngredientDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.removeFromFavorites(removeFavoriteDto, user.id);
  }

  @ApiOperation({ summary: 'Получение списка избранных ингредиентов с пагинацией' })
  @ApiResponse({
    status: 200,
    description: 'Список избранных ингредиентов',
    type: FavoriteIngredientsResponseDto,
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Размер страницы (по умолчанию 10, максимум 100)',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы (по умолчанию 1)',
  })
  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  getFavoriteIngredients(@Query() query: FavoriteIngredientsQueryDto, @CurrentUser() user: UserPayload) {
    return this.ingredientService.getFavoriteIngredients(query, user.id);
  }

  @ApiOperation({ summary: 'Получение избранного ингредиента по ID' })
  @ApiResponse({
    status: 200,
    description: 'Избранный ингредиент',
    type: IngredientModel,
  })
  @ApiResponse({
    status: 404,
    description: 'Избранный ингредиент не найден',
  })
  @UseGuards(JwtAuthGuard)
  @Get('favorites/:id')
  getFavoriteIngredientById(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    return this.ingredientService.getFavoriteIngredientById(id, user.id);
  }
}
