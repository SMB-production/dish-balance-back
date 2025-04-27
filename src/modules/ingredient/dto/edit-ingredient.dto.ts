import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class EditIngredientDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNumber()
  caloriesPer100g: number;

  @ApiProperty()
  @IsNumber()
  proteinPer100g: number;

  @ApiProperty()
  @IsNumber()
  fatPer100g: number;

  @ApiProperty()
  @IsNumber()
  carbohydratesPer100g: number;
}
