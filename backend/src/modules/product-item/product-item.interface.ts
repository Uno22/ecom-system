import { ProductItem } from './model/product-item.model';
import {
  CondProductItemDto,
  CreateProductItemDto,
  FinalizeOrderDto,
  ListProductItemByIdsDto,
  UpdateProductItemDto,
  ValidateAndReserveProductItemDto,
} from './dto';
import { IRepository, IService } from 'src/share/interfaces';

export interface IProductItemService
  extends IService<
    ProductItem,
    CreateProductItemDto,
    UpdateProductItemDto,
    CondProductItemDto
  > {
  listByIds(payload: ListProductItemByIdsDto): Promise<Array<ProductItem>>;
  listyByProductId(id: string): Promise<Array<ProductItem>>;
  validateAndReserve(
    payload: ValidateAndReserveProductItemDto,
  ): Promise<boolean>;
  finalizeOrder(data: FinalizeOrderDto): Promise<boolean>;
}

export interface IProductItemRepository
  extends IRepository<ProductItem, UpdateProductItemDto, CondProductItemDto> {
  validateAndReserve(data: ValidateAndReserveProductItemDto): Promise<boolean>;
  finalizeOrder(data: FinalizeOrderDto): Promise<boolean>;
}
