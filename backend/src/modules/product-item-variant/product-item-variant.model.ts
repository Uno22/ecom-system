import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { ProductItem } from '../product-item/model/product-item.model';
import { VariantItem } from '../variant/model/variant-item.model';
import { Product } from '../product/model/product.model';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'product_item_variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProductItemVariant extends Model<ProductItemVariant> {
  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  productId?: string;

  @ForeignKey(() => ProductItem)
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_item_id' })
  productItemId: string;

  @BelongsTo(() => ProductItem)
  productItem?: ProductItem;

  @ForeignKey(() => VariantItem)
  @Column({ type: DataType.UUID, allowNull: false, field: 'variant_item_id' })
  variantItemId: string;

  @BelongsTo(() => VariantItem)
  variantItem?: VariantItem;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  status: ModelStatus;
}
