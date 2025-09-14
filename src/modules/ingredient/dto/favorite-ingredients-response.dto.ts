import { ApiProperty } from '@nestjs/swagger';
import { IngredientModel } from '../ingredient.model';

export class FavoriteIngredientsResponseDto {
  @ApiProperty({ description: 'Список избранных ингредиентов', type: [IngredientModel] })
  ingredients: IngredientModel[];

  @ApiProperty({ description: 'Общее количество элементов' })
  totalCount: number;

  @ApiProperty({ description: 'Размер страницы' })
  pageSize: number;

  @ApiProperty({ description: 'Текущая страница' })
  page: number;

  @ApiProperty({ description: 'Общее количество страниц' })
  totalPages: number;
}
