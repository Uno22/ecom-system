import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { ModelStatus } from 'src/share/constants/enum';

@Table({
  tableName: 'categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class Category extends Model<Category> {
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare image?: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'parent_id' })
  declare parentId?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  declare description?: string;

  @Column({ type: DataType.NUMBER, allowNull: true, defaultValue: 0 })
  declare position?: number;

  @Column({
    type: DataType.ENUM(...Object.values(ModelStatus)),
    allowNull: false,
    defaultValue: ModelStatus.ACTIVE,
  })
  declare status: ModelStatus;
}
