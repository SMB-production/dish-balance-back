import { ApiProperty } from '@nestjs/swagger';

export class DeleteIngredientDto {
  @ApiProperty()
  readonly id: string;
}
