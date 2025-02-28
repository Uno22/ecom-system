import { Inject, Injectable } from '@nestjs/common';
import { CondProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { IProductRepository, IProductService } from './product.interface';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';
import { Product } from './model/product.model';
import { PRODUCT_REPOSITORY } from './product.di-token';
import { CreationAttributes, Op, Sequelize } from 'sequelize';
import {
  DataDuplicatedException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';
import { validateDataObjectEmpty } from 'src/share/utils/validate';

@Injectable()
export class ProductService implements IProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
  ) {}

  async create(data: CreateProductDto): Promise<Product | null> {
    const isDataExist = await this.productRepo.findByCond({
      name: {
        [Op.regexp]: Sequelize.literal(`LOWER('${data.name}')`),
      },
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newProduct = {
      ...data,
      id: v7(),
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.productRepo.insert(newProduct as CreationAttributes<Product>);
  }

  async findOne(id: string): Promise<Product | null> {
    const data = await this.productRepo.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }
    return data;
  }

  async findAll(
    cond: CondProductDto,
    paging: PagingDto,
  ): Promise<IListEntity<Product>> {
    if (cond.name) {
      cond['name'] = { [Op.regexp]: cond.name } as any;
    }

    return this.productRepo.list(cond, paging);
  }

  async update(id: string, data: UpdateProductDto): Promise<boolean> {
    validateDataObjectEmpty(data);

    const currentData = await this.productRepo.get(id);
    if (!currentData || currentData.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }

    return this.productRepo.update(id, data);
  }

  async remove(id: string, isHardDelete: boolean): Promise<boolean> {
    return this.productRepo.delete(id, isHardDelete);
  }
}
