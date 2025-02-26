import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUserRepository, IUserService } from './user.interface';
import { USER_REPOSITORY } from './user.di-token';
import { ErrDataDuplicated, ErrDataNotFound } from 'src/share/model/error';
import { AppError } from 'src/share/app-error';
import { UserGender, UserRole, UserStatus } from 'src/share/model/enum';
import { v7 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { User } from './model/user.model';
import { CreationAttributes } from 'sequelize';
import { omit } from 'lodash';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;

    const isDataExist = await this.userRepo.findByCond({
      email: email,
    });

    if (isDataExist) {
      throw AppError.from(ErrDataDuplicated, 401);
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
    console.log('createdUser', createdUser);
    return omit(createdUser, ['password']);
  }

  async findOne(id: string) {
    const data = await this.userRepo.get(id);
    if (!data || data.status === UserStatus.DELETED) {
      throw AppError.from(ErrDataNotFound, 404);
    }
    return data;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const currentData = await this.userRepo.get(id);
    if (!currentData || currentData.status === UserStatus.DELETED) {
      throw AppError.from(ErrDataNotFound, 404);
    }

    return await this.userRepo.update(id, updateUserDto);
  }
}
