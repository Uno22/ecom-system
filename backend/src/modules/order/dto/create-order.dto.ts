import { PickType } from '@nestjs/swagger';
import { OrderDto } from './order.dto';

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
]) {}
