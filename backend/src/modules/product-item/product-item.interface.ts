import { ProductItem } from './model/product-item.model';
import {
  CondProductItemDto,
  CreateProductItemDto,
  ListProductItemByIdsDto,
  ReserveProductItem,
  ReserveProductItemOrderDto,
  UpdateProductItemDto,
} from './dto';
import { IRepository, IService } from 'src/share/interfaces';
import { Transaction } from 'sequelize';

export interface IProductItemService
  extends IService<
    ProductItem,
    CreateProductItemDto,
    UpdateProductItemDto,
    CondProductItemDto
  > {
  listByIds(payload: ListProductItemByIdsDto): Promise<Array<ProductItem>>;
  listyByProductId(id: string): Promise<Array<ProductItem>>;
  reserveProductItemDuringOrderCreation(
    payload: ReserveProductItemOrderDto,
  ): Promise<boolean>;
}

export interface IProductItemRepository
  extends IRepository<ProductItem, UpdateProductItemDto, CondProductItemDto> {
  reserveProductItems(
    productItems: ReserveProductItem[],
    transaction: Transaction,
  );
  releaseProductItems(
    productItems: ReserveProductItem[],
    transaction: Transaction,
  );
  deductProductItems(
    productItems: ReserveProductItem[],
    transaction: Transaction,
  );
  findByIds(ids: string[]): Promise<Array<ProductItem>>;
}
