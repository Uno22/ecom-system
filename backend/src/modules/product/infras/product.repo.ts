import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatic } from 'sequelize';
import { UpdateProductDto, CondProductDto } from '../dto';
import { Product } from '../model/product.model';
import { BaseRepository } from 'src/share/infras/base.repo';

@Injectable()
export class ProductRepository extends BaseRepository<
  Product,
  UpdateProductDto,
  CondProductDto
> {
  constructor(@InjectModel(Product) model: ModelStatic<Product>) {
    super(model);
  }
}
