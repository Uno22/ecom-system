import {
  Column,
  DataType,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingMethod,
} from 'src/share/constants/enum';
import { OrderItem } from './oder-item.model';

@Table({
  tableName: 'orders',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Order extends Model<Order> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @HasMany(() => OrderItem)
  orderItems?: OrderItem[];

  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  declare userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ShippingMethod)),
    field: 'shipping_method',
    allowNull: false,
  })
  declare shippingMethod: ShippingMethod;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    field: 'shipping_cost',
    validate: { min: 0 },
  })
  declare shippingCost: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'shipping_address',
  })
  declare shippingAddress: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'shipping_city',
  })
  declare shippingCity: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient_first_name',
  })
  declare recipientFirstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient_last_name',
  })
  declare recipientLastName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient_phone',
  })
  declare recipientPhone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'recipient_email',
  })
  declare recipientEmail: string;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentMethod)),
    allowNull: false,
    field: 'payment_method',
  })
  declare paymentMethod: PaymentMethod;

  @Column({
    type: DataType.ENUM(...Object.values(PaymentStatus)),
    allowNull: false,
    field: 'payment_status',
  })
  declare paymentStatus: PaymentStatus;

  @Column({
    type: DataType.DECIMAL(20, 2),
    allowNull: false,
    field: 'total_price',
    validate: { min: 0 },
  })
  declare totalPrice: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'tracking_number',
  })
  declare trackingNumber?: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrderStatus)),
    allowNull: false,
    defaultValue: OrderStatus.PENDING,
  })
  declare status: OrderStatus;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  declare history?: object;
}
