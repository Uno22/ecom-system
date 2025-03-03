import { ModelStatus } from 'src/share/constants/enum';

export class OrderCartDto {
  id: string;
  userId: string;
  status: ModelStatus;
  cartItems?: OrderCartItemDto[];
}

export class OrderCartItemDto {
  id: string;
  orderId: string;
  productItemId: string;
  name: string;
  quantity: number;
  salePrice: number;
}
