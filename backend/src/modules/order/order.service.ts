import { Inject, Injectable } from '@nestjs/common';
import { IOrderRepository, IOrderService } from './order.interface';
import { ORDER_REPOSITORY } from './order.di-token';
import { CreateOrderDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrderService implements IOrderService {
  constructor(
    @Inject(ORDER_REPOSITORY) private readonly orderRepo: IOrderRepository,
  ) {}

  create(userId: string, createOrderDto: CreateOrderDto): Promise<string> {
    return 'This action adds a new order' as any;
  }

  findAll() {
    return `This action returns all order`;
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
