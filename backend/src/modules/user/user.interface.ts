import { CreationAttributes } from 'sequelize';
import { CondUserDto } from './dto/cond-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User | null>;
  findOne(id: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<boolean>;
  findByCond(cond: CondUserDto, options?: object): Promise<User | null>;
}

export interface IUserRepository {
  insert(data: CreationAttributes<User>): Promise<User | null>;
  get(id: string, options?: object): Promise<User | null>;
  update(id: string, data: UpdateUserDto): Promise<boolean>;
  findByCond(cond: CondUserDto, options?: object): Promise<User | null>;
}
