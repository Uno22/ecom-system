import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CartProductDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product item',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: 'Iphone 15 Pro Max',
    description: 'The name of product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 20000000,
    description: 'The sale price of product item',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({
    example: 25000000,
    description: 'The price of product item',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(99999999.99)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 0,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description:
      'The reserved quantity when customer place order but not finish payment yet',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @ApiProperty({
    description:
      'The list of attributes of product item such as: name and value',
  })
  @IsOptional()
  attributes?: object[];
}
