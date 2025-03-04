import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { ProductItem } from '../../product-item/model/product-item.model';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'products',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Product extends Model<Product> {
  declare id: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'category_id' })
  declare categoryId: string;

  @Column({ type: DataType.UUID, allowNull: false, field: 'brand_id' })
  declare brandId: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  declare status: ModelStatus;

  @HasMany(() => ProductItem)
  productItems?: ProductItem[];
}
