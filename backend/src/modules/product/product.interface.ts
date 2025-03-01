import { IRepository, IService } from 'src/share/interfaces';
import {
  CreateProductDto,
  UpdateProductDto,
  CondProductDto,
  ProductBrandDto,
  ProductCategoryDto,
} from './dto';
import { Product } from './model/product.model';

export interface IProductService
  extends IService<
    Product,
    CreateProductDto,
    UpdateProductDto,
    CondProductDto
  > {}

export interface IProductRepository
  extends IRepository<Product, UpdateProductDto, CondProductDto> {}

export interface IProductBrandRpc {
  get(id: string): Promise<ProductBrandDto | null>;
}

export interface IProductCategoryRpc {
  get(id: string): Promise<ProductCategoryDto | null>;
}
