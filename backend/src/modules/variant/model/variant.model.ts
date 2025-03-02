import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { VariantItem } from './variant-item.model';

@Table({
  tableName: 'variants',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Variant extends Model<Variant> {
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @HasMany(() => VariantItem)
  variantItems?: VariantItem[];
}
