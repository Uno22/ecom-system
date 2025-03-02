import { ApiProperty, PickType } from '@nestjs/swagger';
import { CartItemDto } from './cart.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: '019305be-db14-7776-8bbc-dfd4cfb0f5ed',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsNotEmpty()
  productItemId: string;

  @ApiProperty({
    example: 3,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class CreateCartItemDto extends PickType(CartItemDto, []) {}
