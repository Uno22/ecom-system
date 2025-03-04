import { InjectModel } from '@nestjs/sequelize';
import { ProductItem } from '../model/product-item.model';
import { Injectable } from '@nestjs/common';
import {
  CreateOptions,
  CreationAttributes,
  ModelStatic,
  Op,
  Transaction,
} from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';
import {
  UpdateProductItemDto,
  CondProductItemDto,
  FinalizeOrderDto,
  ProductItemAttributeDto,
  ReserveProductItem,
} from '../dto';
import { IProductItemRepository } from '../product-item.interface';
import { Sequelize } from 'sequelize-typescript';
import { ProductItemVariant } from 'src/modules/product-item-variant/product-item-variant.model';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';

@Injectable()
export class ProductItemRepository
  extends BaseRepository<ProductItem, UpdateProductItemDto, CondProductItemDto>
  implements IProductItemRepository
{
  constructor(
    @InjectModel(ProductItem)
    readonly productItemModel: ModelStatic<ProductItem>,
    @InjectModel(ProductItemVariant)
    readonly productItemVariantModel: ModelStatic<ProductItemVariant>,
    private readonly sequelize: Sequelize,
  ) {
    super(productItemModel);
  }

  async insert(
    data: CreationAttributes<ProductItem>,
    options?: CreateOptions<ProductItem> & { transaction?: Transaction },
  ): Promise<ProductItem | null> {
    const { transaction } = options || {};
    const attributes = (data as any).attributes || [];
    if (attributes.length > 0) {
      const bulkProductItemVariants = attributes.map(
        (attr: ProductItemAttributeDto) => ({
          id: v7(),
          productId: data.productId,
          productItemId: data.id,
          variantItemId: attr.variantItemId,
          status: ModelStatus.ACTIVE,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      await this.productItemVariantModel.bulkCreate(bulkProductItemVariants, {
        transaction,
      });
    }

    delete (data as any).attributes;
    return this.productItemModel.create(data, {
      raw: true,
      ...options,
      transaction,
    });
  }

  async reserveProductItems(
    productItems: ReserveProductItem[],
    transaction: Transaction,
  ) {
    return Promise.all(
      productItems.map((item: ReserveProductItem) =>
        this.productItemModel.update(
          {
            reservedQuantity: this.sequelize.literal(
              `reserved_quantity + ${item.reserveQuantity}`,
            ),
          },
          {
            where: {
              id: item.productItemId,
              [Op.and]: [
                this.sequelize.literal(
                  `(quantity - reserved_quantity) >= ${item.reserveQuantity}`,
                ),
              ],
            },
            transaction,
          },
        ),
      ),
    );
  }
}
