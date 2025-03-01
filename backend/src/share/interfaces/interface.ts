import { PagingDto } from 'src/share/dto/paging.dto';
import { UserRole } from '../constants/enum';
import { Handler } from 'express';
import {
  CreateOptions,
  CreationAttributes,
  FindOptions,
  Model,
} from 'sequelize';

export interface IService<CreateDTO, UpdateDTO, Entity, Cond> {
  create(data: CreateDTO): Promise<Entity | null>;
  findOne(id: string): Promise<Entity | null>;
  findAll(cond: Cond, paging: PagingDto): Promise<IListEntity<Entity>>;
  update(id: string, data: UpdateDTO): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICommandRepository<Entity extends Model, UpdateDto> {
  insert(
    data: CreationAttributes<Entity>,
    options?: CreateOptions<Entity>,
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
