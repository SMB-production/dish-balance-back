import { ApiProperty } from '@nestjs/swagger';

export class AddIngredientDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  caloriesPer100g: number;

  @ApiProperty()
  proteinPer100g: number;

  @ApiProperty()
  fatPer100g: number;

  @ApiProperty()
  carbohydratesPer100g: number;
}
