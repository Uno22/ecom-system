import { CreateOrderDto, OrderCartDto, UpdateOrderDto } from './dto';
import { Order } from './model/order.model';

export interface IOrderRepository {
  insert(data: Order): Promise<boolean>;
  update(id: string, data: UpdateOrderDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface IOrderService {
  create(userId: string, createOrderDto: CreateOrderDto): Promise<string>;
}

export interface IOrderCartRpc {
  getCartByUserId(userId: string): Promise<OrderCartDto | null>;
  deleteCartById(id: string): Promise<boolean>;
}
