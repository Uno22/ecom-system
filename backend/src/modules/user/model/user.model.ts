import { Table, Column, Model, DataType } from 'sequelize-typescript';
import { UserGender, UserRole, UserStatus } from 'src/share/constants/enum';
import * as bcrypt from 'bcryptjs';

@Table({
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class User extends Model<User> {
  declare id: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'first_name' })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'last_name' })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  email: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  phone?: string;

  @Column({ type: DataType.STRING, allowNull: true })
  address?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserStatus)),
    allowNull: false,
    defaultValue: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserGender)),
    allowNull: true,
    defaultValue: UserGender.UNKNOWN,
  })
  gender?: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: true,
    defaultValue: UserRole.USER,
  })
  role?: string;

  @Column({ type: DataType.DATE, allowNull: true })
  birthday?: Date;

  async comparePassword(plainPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, this.get('password'));
  }
}
