import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Variant } from './variant.model';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'variant_items',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class VariantItem extends Model<VariantItem> {
  declare id: string;

  @ForeignKey(() => Variant)
  @Column({ type: DataType.UUID, allowNull: false, field: 'variant_id' })
  variantId: string;

  @BelongsTo(() => Variant)
  variant?: Variant;

  @Column({ type: DataType.STRING, allowNull: false })
  value: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  status: ModelStatus;
}
