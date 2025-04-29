import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';
import { IsNotEmptyNumberDecorator } from '../../../common/decorators/is-not-empty-number.decorator';

export class EditIngredientDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  @IsNumber()
  caloriesPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  @IsNumber()
  proteinPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  @IsNumber()
  fatPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  @IsNumber()
  carbohydratesPer100g: number;
}
