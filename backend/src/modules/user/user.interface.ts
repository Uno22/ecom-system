import { CondUserDto } from './dto/cond-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { IRepository, IService } from 'src/share/interfaces';

export interface IUserService
  extends IService<User, CreateUserDto, UpdateUserDto, CondUserDto> {
  findByCond(cond: CondUserDto, options: object): Promise<User | null>;
}

export interface IUserRepository
  extends IRepository<User, UpdateUserDto, CondUserDto> {}
