import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from 'src/share/constants/enum';

export class CreateOrderDto extends PickType(OrderDto, [
  'shippingMethod',
  'shippingCost',
  'shippingAddress',
  'shippingCity',
  'recipientFirstName',
  'recipientLastName',
  'recipientPhone',
  'recipientEmail',
  'paymentMethod',
]) {
  @ApiProperty({
    example: [{ id: '019305be-db14-7776-8bbc-dfd4cfb0f5ed', quantity: 1 }],
    description: 'The list of product item id',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductItemDto)
  @IsNotEmpty()
  productItems: CreateProductItemDto[];
}

export class CreateProductItemDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 1,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  quantity: number;
}

export class ResponseCreateOrderDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of order',
  })
  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'The status of order',
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    example: 'Received request order',
    description: 'Order processing message',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}
