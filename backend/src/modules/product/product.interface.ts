import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';
import { CreateProductDto, UpdateProductDto, CondProductDto } from './dto';
import { CreationAttributes } from 'sequelize';
import { Product } from './model/product.model';

export interface IProductService {
  create(data: CreateProductDto): Promise<Product | null>;
  findOne(id: string): Promise<Product | null>;
  findAll(
    cond: CondProductDto,
    paging: PagingDto,
  ): Promise<IListEntity<Product>>;
  update(id: string, data: UpdateProductDto): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface IProductRepository {
  insert(data: CreationAttributes<Product>): Promise<Product | null>;
  update(id: string, data: UpdateProductDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
  get(id: string, options?: object): Promise<Product | null>;
  list(
    cond: CondProductDto,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Product>>;
  findByCond(cond: CondProductDto): Promise<Product | null>;
}
