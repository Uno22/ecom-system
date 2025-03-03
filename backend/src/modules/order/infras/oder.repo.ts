import { Injectable } from '@nestjs/common';
import { CreationAttributes, ModelStatic } from 'sequelize';
import { Order } from '../model/order.model';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from '../model/oder-item.model';
import { IOrderRepository } from '../order.interface';
import { UpdateOrderDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order) private readonly orderModel: ModelStatic<Order>,
    @InjectModel(OrderItem)
    private readonly orderItemModel: ModelStatic<OrderItem>,
    private readonly sequelize: Sequelize,
  ) {}

  async insert(data: Order): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      await this.orderModel.create(data, { transaction });
      await this.orderItemModel.bulkCreate(
        data.orderItems as Array<CreationAttributes<OrderItem>>,
        { transaction },
      );
      await transaction.commit();
      return true;
    } catch (error) {
      console.error('[ERROR] ********** OrderRepository insert error', error);
      await transaction.rollback();
      return false;
    }
  }

  update(id: string, data: UpdateOrderDto): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  delete(id: string, isHardDelete: boolean): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
