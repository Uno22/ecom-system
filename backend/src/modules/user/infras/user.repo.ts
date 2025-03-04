import { InjectModel } from '@nestjs/sequelize';
import { CondUserDto } from '../dto/cond-user.dto';
import { User } from '../model/user.model';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ModelStatic } from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';

export type CreateUserAttributes = Omit<User, 'createdAt' | 'updatedAt'>;

export class UserRepository extends BaseRepository<
  User,
  UpdateUserDto,
  CondUserDto
> {
  constructor(@InjectModel(User) model: ModelStatic<User>) {
    super(model);
  }
}
