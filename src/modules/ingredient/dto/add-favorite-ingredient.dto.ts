import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddFavoriteIngredientDto {
  @ApiProperty({ description: 'ID ингредиента для добавления в избранное' })
  @IsUUID('4', { message: 'Ingredient ID must be a valid UUID' })
  ingredientId: string;
}
