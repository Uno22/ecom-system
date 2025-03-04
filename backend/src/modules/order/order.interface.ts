import { CreationAttributes } from 'sequelize';
import { CreateOrderDto, OrderCartDto, UpdateOrderDto } from './dto';
import { Order } from './model/order.model';
import { ReserveProductItemDto } from '../product-item/dto';

export interface IOrderRepository {
  insert(data: CreationAttributes<Order>): Promise<boolean>;
  get(id: string, options?: object): Promise<Order | null>;
  update(id: string, data: UpdateOrderDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface IOrderService {
  create(userId: string, createOrderDto: CreateOrderDto): Promise<string>;
}

export interface IOrderCartRpc {
  getCartByUserId(userId: string): Promise<OrderCartDto | null>;
  deleteCartItemByIds(ids: string[]): Promise<boolean>;
}

export interface IOrderProductRpc {
  reserveProduct(productItems: ReserveProductItemDto[]): Promise<boolean>;
}
