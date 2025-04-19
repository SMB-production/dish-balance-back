import { Ingredients } from './ingredients';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateDPFCDishes {
  @ApiProperty({ example: 'Салат', description: 'Название блюда' })
  readonly name: string;
  @ApiProperty({
    example: [
      {
        name: 'Помидор',
        weight: 200,
        caloriesPer100g: 18,
        proteinPer100g: 0.9,
        fatPer100g: 0.2,
        carbohydratesPer100g: 3.9,
      },
    ],
    description: 'Список ингредиентов с их пищевой ценностью',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        weight: { type: 'number' },
        caloriesPer100g: { type: 'number' },
        proteinPer100g: { type: 'number' },
        fatPer100g: { type: 'number' },
        carbohydratesPer100g: { type: 'number' },
      },
    },
  })
  readonly ingredients: Ingredients[];
}
