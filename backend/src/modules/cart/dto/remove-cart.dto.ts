import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsUUID } from 'class-validator';

export class RemoveCartItemDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: '019305be-db14-7776-8bbc-dfd4cfb0f5ed',
    description: 'The id of cart item',
  })
  @IsUUID()
  @IsNotEmpty()
  cartItemId?: string;
}
