import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../product/model/product.model';
import { ModelStatus } from 'src/share/constants/enum';
import { ProductItemVariant } from 'src/modules/product-item-variant/product-item-variant.model';

@Table({
  tableName: 'product_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductItem extends Model<ProductItem> {
  declare id: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: true, field: 'product_id' })
  declare productId?: string;

  @BelongsTo(() => Product)
  declare product?: Product;

  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  declare categoryId: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'brand_id' })
  declare brandId: string;

  @HasMany(() => ProductItemVariant)
  declare variantItems?: ProductItemVariant[];

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
  })
  declare price: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    field: 'sale_price',
  })
  declare salePrice: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: { min: 0 },
  })
  declare quantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'reserved_quantity',
    defaultValue: 0,
    validate: { min: 0 },
  })
  declare reservedQuantity: number;

  @Column({ type: DataType.STRING, allowNull: true })
  declare sku: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare content: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @Column({
    type: DataType.FLOAT(1, 1),
    allowNull: true,
    validate: { min: 0, max: 5 },
  })
  declare rating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: 'sale_count',
    defaultValue: 0,
    validate: { min: 0 },
  })
  declare saleCount: number;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  declare status: ModelStatus;
}
