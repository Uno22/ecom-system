import { IRepository, IService } from 'src/share/interfaces';
import { CreateProductDto, UpdateProductDto, CondProductDto } from './dto';
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
