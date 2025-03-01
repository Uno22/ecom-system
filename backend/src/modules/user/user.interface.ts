import { CondUserDto } from './dto/cond-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './model/user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { IRepository } from 'src/share/interfaces';

export interface IUserService {
  create(createUserDto: CreateUserDto): Promise<User | null>;
  findOne(id: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<boolean>;
  findByCond(cond: CondUserDto, options?: object): Promise<User | null>;
}

export interface IUserRepository
  extends IRepository<User, UpdateUserDto, CondUserDto> {}
