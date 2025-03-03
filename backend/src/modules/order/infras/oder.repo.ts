import { Injectable } from '@nestjs/common';
import { CreationAttributes, ModelStatic } from 'sequelize';
import { Order } from '../model/order.model';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from '../model/oder-item.model';
import { IOrderRepository } from '../order.interface';
import { UpdateOrderDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { OrderStatus } from 'src/share/constants/enum';

@Injectable()
export class OrderRepository implements IOrderRepository {
  constructor(
    @InjectModel(Order) private readonly orderModel: ModelStatic<Order>,
    @InjectModel(OrderItem)
    private readonly orderItemModel: ModelStatic<OrderItem>,
    private readonly sequelize: Sequelize,
  ) {}

  async insert(data: CreationAttributes<Order>): Promise<boolean> {
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

  async delete(id: string, isHardDelete: boolean): Promise<boolean> {
    if (isHardDelete) {
      const deletedRow = await this.orderModel.destroy({
        where: { id },
      } as any);
      await this.orderItemModel.destroy({
        where: { orderId: id },
      });
      return deletedRow > 0;
    }

    const [affectedRows] = await this.orderModel.update(
      { status: OrderStatus.DELETED },
      { where: { id } } as any,
    );
    return affectedRows > 0;
  }
}
