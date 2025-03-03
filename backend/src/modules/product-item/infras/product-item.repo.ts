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
    options?: CreateOptions<ProductItem>,
  ): Promise<ProductItem | null> {
    const transaction = await this.sequelize.transaction();
    try {
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
      const insertedData = await this.productItemModel.create(data, {
        raw: true,
        ...options,
        transaction,
      });

      await transaction.commit();

      return insertedData;
    } catch (error) {
      console.error('[ERROR] ********** product item insert error', error);
      await transaction.rollback();
      return null;
    }
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

  async finalizeOrder(data: FinalizeOrderDto): Promise<boolean> {
    const transaction = await this.sequelize.transaction();
    try {
      const reserveProductItems = data.items;

      for (const reserveItem of reserveProductItems) {
        const [updatedRows] = await this.productItemModel.update(
          {
            reservedQuantity: Sequelize.literal(
              `reserved_quantity - ${reserveItem.reserveQuantity}`,
            ),
          },
          {
            where: {
              id: reserveItem.productItemId,
              reservedQuantity: { [Op.gte]: reserveItem.reserveQuantity },
            },
            transaction,
          },
        );
        if (updatedRows === 0) {
          throw new Error(
            `found invalid reserved quantity: ${JSON.stringify(reserveItem)}`,
          );
        }
      }

      await transaction.commit();
      return true;
    } catch (error) {
      console.error('[ERROR] ********** finalize order error', error);
      await transaction.rollback();
      return false;
    }
  }
}
