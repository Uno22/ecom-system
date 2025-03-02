import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { CartItem } from './cart-item.model';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'carts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Cart extends Model<Cart> {
  declare id: string;

  @HasMany(() => CartItem)
  cartItems?: CartItem[];

  @Column({ type: DataType.UUID, allowNull: false, field: 'user_id' })
  userId: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  status: ModelStatus;
}
