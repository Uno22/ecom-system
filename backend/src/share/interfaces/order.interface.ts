import { OrderStatus } from '../constants/enum';

export interface IOrderMessage {
  userId: string;
  orderId: string;
  status: OrderStatus;
  productItems: IProductItemMessage[];
  [key: string]: any;
}

export interface IProductItemMessage {
  id: string;
  quantity: number;
}
