import { PagingDto } from 'src/share/model/paging';
import { UserRole } from './model/enum';
import { Handler } from 'express';

export interface IService<CreateDTO, UpdateDTO, Entity, Cond> {
  create(data: CreateDTO): Promise<Entity | null>;
  findOne(id: string): Promise<Entity | null>;
  findAll(cond: Cond, paging: PagingDto): Promise<IListEntity<Entity>>;
  update(id: string, data: UpdateDTO): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICommandRepository<Entity, UpdateDto> {
  insert(data: Entity): Promise<Entity | null>;
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
  findByCond(cond: Cond): Promise<Entity | null>;
}

export interface IRepository<Entity, UpdateDto, Cond>
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

export interface Requester extends TokenPayload {}

export interface ITokenProvider {
  generateToken(payload: TokenPayload): Promise<string>;
  verifyToken(token: string): Promise<TokenPayload | null>;
}

export type TokenIntrospectResult = {
  payload: TokenPayload | null;
  error?: Error;
  isOk: boolean;
};

export interface ITokenIntrospect {
  introspect(token: string): Promise<TokenIntrospectResult>;
}

export interface Mdlfactor {
  auth: Handler;
  allowRoles: (roles: UserRole[]) => Handler;
}

export type ServiceContext = {
  mdlFactory: Mdlfactor;
};

export type UID = string;
