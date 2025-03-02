import { InjectModel } from '@nestjs/sequelize';
import { ProductItem } from '../model/product-item.model';
import { Injectable } from '@nestjs/common';
import { CreateOptions, CreationAttributes, ModelStatic, Op } from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';
import {
  UpdateProductItemDto,
  CondProductItemDto,
  FinalizeOrderDto,
  ValidateAndReserveProductItemDto,
  ProductItemAttributeDto,
} from '../dto';
import { IProductItemRepository } from '../product-item.interface';
import { Sequelize } from 'sequelize-typescript';
import { ProductItemVariant } from 'src/modules/product-item-variant/product-item-variant.model';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';
import { omit } from 'lodash';

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

  async validateAndReserve(
    data: ValidateAndReserveProductItemDto,
  ): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      const reserveProductItems = data.items;

      for (const reserveItem of reserveProductItems) {
        const [updatedRows] = await this.productItemModel.update(
          {
            quantity: Sequelize.literal(
              `quantity - ${reserveItem.reserveQuantity}`,
            ),
            reservedQuantity: Sequelize.literal(
              `reserved_quantity + ${reserveItem.reserveQuantity}`,
            ),
          },
          {
            where: {
              id: reserveItem.productItemId,
              quantity: { [Op.gte]: reserveItem.reserveQuantity },
            },
            transaction,
          },
        );
        if (updatedRows === 0) {
          throw new Error(
            `found a product is not enough quantity: ${JSON.stringify(
              reserveItem,
            )}`,
          );
        }
      }

      await transaction.commit();
      return true;
    } catch (error) {
      console.error(
        '[ERROR] ********** rollback validate and reserve product',
        error,
      );
      await transaction.rollback();
      return false;
    }
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
