import { ApiProperty, PickType } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { IsNotEmpty, IsString } from 'class-validator';

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
    example: ['01954067-e76c-7864-ac12-de61732b338a'],
    description: 'The list of product item id',
  })
  @IsString({ each: true })
  @IsNotEmpty()
  productItemIds: string[];
}
