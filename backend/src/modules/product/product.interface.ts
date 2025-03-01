import { PagingDto } from 'src/share/dto';
import { IListEntity, IRepository } from 'src/share/interfaces';
import { CreateProductDto, UpdateProductDto, CondProductDto } from './dto';
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

export interface IProductRepository
  extends IRepository<Product, UpdateProductDto, CondProductDto> {}
