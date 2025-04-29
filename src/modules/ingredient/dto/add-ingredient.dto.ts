import { ApiProperty } from '@nestjs/swagger';
import { Min } from 'class-validator';
import { IsNotEmptyNumberDecorator } from '../../../common/decorators/is-not-empty-number.decorator';

export class AddIngredientDto {
  @ApiProperty()
  name: string;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  caloriesPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  proteinPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  fatPer100g: number;

  @Min(0, { message: 'Value must be positive or zero' })
  @IsNotEmptyNumberDecorator()
  @ApiProperty()
  carbohydratesPer100g: number;
}
