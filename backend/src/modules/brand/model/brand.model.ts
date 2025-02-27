import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'brands',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Brand extends Model<Brand> {
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  image: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'tag_line' })
  tagLine: string;

  @Column({ type: DataType.STRING, allowNull: true })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  status: ModelStatus;
}
