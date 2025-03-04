import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Order } from './order.model';

@Table({
  tableName: 'order_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class OrderItem extends Model<OrderItem> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false, field: 'order_id' })
  declare orderId: string;

  @BelongsTo(() => Order)
  order?: Order;

  @Column({ type: DataType.UUID, allowNull: false, field: 'product_item_id' })
  declare productItemId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare name: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  })
  declare quantity: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'sale_price',
  })
  declare salePrice: number;
}
