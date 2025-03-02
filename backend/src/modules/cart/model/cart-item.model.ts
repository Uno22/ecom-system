import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Cart } from './cart.model';

@Table({
  tableName: 'cart_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CartItem extends Model<CartItem> {
  declare id: string;

  @ForeignKey(() => Cart)
  @Column({ type: DataType.UUID, allowNull: false, field: 'cart_id' })
  cartId: string;

  @BelongsTo(() => Cart)
  cart?: Cart;

  @Column({ type: DataType.UUID, allowNull: false, field: 'product_item_id' })
  productItemId: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  })
  quantity: number;
}
