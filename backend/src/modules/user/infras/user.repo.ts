import { InjectModel } from '@nestjs/sequelize';
import { CondUserDto } from '../dto/cond-user.dto';
import { User } from '../model/user.model';
import { IUserRepository } from '../user.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CreationAttributes } from 'sequelize';

export type CreateUserAttributes = Omit<User, 'createdAt' | 'updatedAt'>;

export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User) private model: typeof User) {}

  async insert(data: CreationAttributes<User>): Promise<User | null> {
    return (await this.model.create(data)).toJSON() as User;
  }

  async get(id: string, options?: object): Promise<User | null> {
    const findOptions = { raw: true, ...options };
    const data: any = await this.model.findByPk(id, findOptions);
    if (!data) {
      return null;
    }

    let rawData = data;
    if (data._previousDataValues) {
      rawData = rawData.get({ plain: true });
    }
    const { created_at, updated_at, ...props } = rawData;

    return {
      ...props,
      createdAt: rawData.created_at,
      updatedAt: rawData.updated_at,
    } as User;
  }

  async update(id: string, data: UpdateUserDto): Promise<boolean> {
    const [affectedRows] = await this.model.update(data, {
      where: { id },
    });
    return affectedRows > 0;
  }

  async findByCond(cond: CondUserDto): Promise<User | null> {
    const data = await this.model.findOne({
      where: cond as any,
      raw: true,
    });
    if (!data) {
      return null;
    }

    return data as User;
  }
}
