import { CreationAttributes } from 'sequelize';
import {
  CondOrderDto,
  CreateOrderDto,
  OrderCartDto,
  ResponseCreateOrderDto,
  UpdateOrderDto,
} from './dto';
import { Order } from './model/order.model';
import { ReserveProductItemDto } from '../product-item/dto';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';

export interface IOrderRepository {
  insert(data: CreationAttributes<Order>): Promise<boolean>;
  get(id: string, options?: object): Promise<Order | null>;
  update(id: string, data: UpdateOrderDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
  list(
    cond: CondOrderDto,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Order>>;
}

export interface IOrderService {
  create(
    userId: string,
    createOrderDto: CreateOrderDto,
  ): Promise<ResponseCreateOrderDto>;
  findAll(cond: CondOrderDto, paging: PagingDto);
  findOne(id: string): Promise<Order | null>;
  findStatus(id: string);
}

export interface IOrderCartRpc {
  getCartByUserId(userId: string): Promise<OrderCartDto | null>;
  deleteCartItemByIds(ids: string[]): Promise<boolean>;
}

export interface IOrderProductRpc {
  reserveProduct(productItems: ReserveProductItemDto[]): Promise<boolean>;
}
