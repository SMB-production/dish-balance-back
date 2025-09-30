import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class RemoveFavoriteIngredientDto {
  @ApiProperty({ description: 'ID ингредиента для удаления из избранного' })
  @IsUUID('4', { message: 'Ingredient ID must be a valid UUID' })
  ingredientId: string;
}
