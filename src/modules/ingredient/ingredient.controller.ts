import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IngredientService } from './ingredient.service';
import { AddIngredientDto } from './dto/add-ingredient.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserPayload } from '../auth/interfaces/user-payload.interface';
import { IngredientModel } from './ingredient.model';
import { DeleteIngredientDto } from './dto/delete-ingredient.dto';
import { EditIngredientDto } from './dto/edit-ingredient.dto';

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
}
