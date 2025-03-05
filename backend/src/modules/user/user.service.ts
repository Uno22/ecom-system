import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository, IUserService } from './user.interface';
import { USER_REPOSITORY } from './user.di-token';
import { UserGender, UserRole, UserStatus } from 'src/share/constants/enum';
import { v7 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { User } from './model/user.model';
import { CreationAttributes } from 'sequelize';
import { omit } from 'lodash';
import { CondUserDto } from './dto/cond-user.dto';
import {
  CustomBadRequestException,
  DataDuplicatedException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  findAll(cond: CondUserDto, paging: PagingDto): Promise<IListEntity<User>> {
    throw new Error('Method not implemented.');
  }

  remove(id: string, isHardDelete: boolean): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const isDataExist = await this.userRepo.findByCond({
      email: email,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      ...createUserDto,
      id: v7(),
      password: hashedPassword,
      status: UserStatus.ACTIVE,
      gender: UserGender.UNKNOWN,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdUser = await this.userRepo.insert(
      newUser as CreationAttributes<User>,
    );

    return omit(createdUser, ['password']) as any;
  }

  async findOne(id: string) {
    const data = await this.userRepo.get(id);
    if (!data || data.status === UserStatus.DELETED) {
      throw new DataNotFoundException();
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto, user?: object) {
    if (
      updateUserDto.role &&
      [UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(updateUserDto.role) &&
      (user as any).role !== UserRole.SUPER_ADMIN
    ) {
      throw new CustomBadRequestException(
        'You have no permission to perform on this resource.',
      );
    }

    const currentData = await this.userRepo.get(id);
    if (!currentData || currentData.status === UserStatus.DELETED) {
      throw new DataNotFoundException();
    }

    return await this.userRepo.update(id, updateUserDto);
  }

  async findByCond(cond: CondUserDto, options: object): Promise<User | null> {
    return await this.userRepo.findByCond(cond, options);
  }

  generatePayload(user: any) {
    return {
      email: user.email,
      sub: user.id,
      role: user.role,
      status: user.status,
    };
  }
}
