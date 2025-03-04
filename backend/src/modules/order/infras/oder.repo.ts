import { Injectable } from '@nestjs/common';
import { CreationAttributes, ModelStatic, Op } from 'sequelize';
import { Order } from '../model/order.model';
import { InjectModel } from '@nestjs/sequelize';
import { OrderItem } from '../model/oder-item.model';
import { IOrderRepository } from '../order.interface';
import { CondOrderDto, UpdateOrderDto } from '../dto';
import { Sequelize } from 'sequelize-typescript';
import { ModelStatus, OrderStatus } from 'src/share/constants/enum';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';

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

  async get(id: string, options?: object): Promise<Order | null> {
    const findOptions = { raw: true, ...options };
    const data: any = await this.orderModel.findByPk(id, findOptions);
    if (!data) {
      return null;
    }

    let rawData = data;
    if (data._previousDataValues) {
      rawData = rawData.get({ plain: true });
    }
    const { created_at, updated_at, ...props } = rawData;

    return {
      ...props,
      createdAt: rawData.created_at || rawData.createdAt,
      updatedAt: rawData.updated_at || rawData.updatedAt,
    } as Order;
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

  async list(
    cond: CondOrderDto,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Order>> {
    const { limit, page } = paging;
    const { type, ...restOptions } = (options || {}) as any;
    const condSQL = { ...cond, status: { [Op.ne]: ModelStatus.DELETED } };
    const findOptions = {
      where: condSQL,
      ...(type !== 'all' && {
        limit,
        offset: (page - 1) * limit,
      }),
      order: [['id', 'DESC']],
      raw: true,
      distinct: true,
      ...restOptions,
    } as any;
    const { count, rows } = await this.orderModel.findAndCountAll(findOptions);
    let rawData = rows;
    if (rawData.length && (rawData[0] as any)._previousDataValues) {
      rawData = rawData.map((data) => data.get({ plain: true }));
    }

    return {
      data: rawData.map((data: any) => {
        const { created_at, updated_at, ...props } = data;
        return {
          ...props,
          createdAt: created_at,
          updatedAt: updated_at,
        } as Order;
      }),
      total: count,
    };
  }
}
