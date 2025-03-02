import { CreateOptions, CreationAttributes } from 'sequelize';
import { CondProductItemVariantDto } from './dto';
import { ProductItemVariant } from './product-item-variant.model';

export interface IProductItemVariantRepository {
  insert(
    data: CreationAttributes<ProductItemVariant>,
    options?: CreateOptions<ProductItemVariant>,
  ): Promise<ProductItemVariant | null>;
  findByCond(
    cond: CondProductItemVariantDto,
    options?: CreateOptions<ProductItemVariant>,
  ): Promise<ProductItemVariant | null>;
  findAll(cond: CondProductItemVariantDto): Promise<Array<ProductItemVariant>>;
  delete(id: string, isHardDelete?: boolean): Promise<boolean>;
  deleteByProductItemId(id: string, isHardDelete?: boolean): Promise<boolean>;
}
