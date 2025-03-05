import { PagingDto } from 'src/share/dto/paging.dto';
import { UserRole, UserStatus } from '../constants/enum';
import { Handler } from 'express';
import {
  CreateOptions,
  CreationAttributes,
  FindOptions,
  Model,
  Transaction,
} from 'sequelize';

export interface IService<Entity, CreateDto, UpdateDto, CondDto> {
  create(data: CreateDto): Promise<Entity | null>;
  findOne(id: string, options?: object): Promise<Entity | null>;
  findAll(cond: CondDto, paging: PagingDto): Promise<IListEntity<Entity>>;
  update(id: string, data: UpdateDto, user?: object): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICommandRepository<Entity extends Model, UpdateDto> {
  insert(
    data: CreationAttributes<Entity>,
    options?: CreateOptions<Entity> & { transaction?: Transaction },
  ): Promise<Entity | null>;
  update(id: string, data: UpdateDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface IQueryRepository<Entity, Cond> {
  get(id: string, options?: object): Promise<Entity | null>;
  list(
    cond: Cond,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Entity>>;
  findByCond(cond: Cond, options?: FindOptions<Entity>): Promise<Entity | null>;
}

export interface IRepository<Entity extends Model, UpdateDto, Cond>
  extends ICommandRepository<Entity, UpdateDto>,
    IQueryRepository<Entity, Cond> {}

export interface IListEntity<Entity> {
  data: Array<Entity>;
  total: number;
}

export interface TokenPayload {
  sub: string;
  role?: UserRole;
  email?: string;
  status?: UserStatus;
}

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

export interface Mdlfactor {
  auth: Handler;
  allowRoles: (roles: UserRole[]) => Handler;
}

export type ServiceContext = {
  mdlFactory: Mdlfactor;
};

export type UID = string;
