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
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'tag_line' })
  declare tagLine: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare description: string;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  declare status: ModelStatus;
}
