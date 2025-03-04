import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';

export class CartDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of cart',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of user',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of cart',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  @IsOptional()
  cartItems?: CartItemDto[];
}

export class CartItemDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of cart item',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of cart',
  })
  @IsUUID()
  @IsNotEmpty()
  cartId: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsNotEmpty()
  productItemId: string;

  @ApiProperty({
    example: 0,
    description: 'The quantity of cart item',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  cart?: { userId: string };
}

export class GetInternalCartDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of user',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
