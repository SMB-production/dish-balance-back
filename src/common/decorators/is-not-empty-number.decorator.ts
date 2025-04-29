import { applyDecorators } from '@nestjs/common';
import { IsNumber, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export const IsNotEmptyNumberDecorator = (options?: { message?: string }) => {
  return applyDecorators(
    IsNotEmpty(),
    IsNumber(
      {},
      {
        message: options?.message || 'Value must be a number',
      },
    ),
    Type(() => Number),
  );
};
