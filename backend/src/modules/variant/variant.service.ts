import { Inject, Injectable } from '@nestjs/common';
import {
  IUpsertVariantResult,
  IVariantItemRepository,
  IVariantRepository,
  IVariantService,
} from './variant.interface';
import { ProductItemAttributeDto } from '../product-item/dto';
import {
  VARIANT_ITEM_REPOSITORY,
  VARIANT_REPOSITORY,
} from './variant.di-token';
import { PRODUCT_ITEM_VARIANT_REPOSITORY } from '../product-item-variant/product-item-variant.di-token';
import { IProductItemVariantRepository } from '../product-item-variant/product-item-variant.interface';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';
import { Variant } from './model/variant.model';
import { CreationAttributes } from 'sequelize';
import { VariantItem } from './model/variant-item.model';
import { ProductItemVariant } from '../product-item-variant/product-item-variant.model';
import { CreateVariantDto, CreateVariantItemDto } from './dto';
import { DataDuplicatedException } from 'src/share/exceptions';

@Injectable()
export class VariantService implements IVariantService {
  constructor(
    @Inject(VARIANT_REPOSITORY)
    private readonly variantRepo: IVariantRepository,
    @Inject(VARIANT_ITEM_REPOSITORY)
    private readonly variantItemRepo: IVariantItemRepository,
    @Inject(PRODUCT_ITEM_VARIANT_REPOSITORY)
    private readonly productItemVariantRepo: IProductItemVariantRepository,
  ) {}

  async createVariant(data: CreateVariantDto): Promise<Variant | null> {
    data.name = data.name.toLowerCase();

    const isDataExist = await this.variantRepo.findByCond({
      name: data.name,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newData = {
      ...data,
      id: v7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.variantRepo.insert(newData as CreationAttributes<Variant>);
  }

  async createVariantItem(
    data: CreateVariantItemDto,
  ): Promise<VariantItem | null> {
    data.value = data.value.toLowerCase();

    const isDataExist = await this.variantItemRepo.findByCond({
      variantId: data.variantId,
      value: data.value,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newData = {
      ...data,
      id: v7(),
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.variantItemRepo.insert(
      newData as CreationAttributes<VariantItem>,
    );
  }

  async upsertVariants(
    attributes: ProductItemAttributeDto[],
  ): Promise<IUpsertVariantResult> {
    try {
      const variantItemIds: string[] = [];
      for (const attribute of attributes) {
        let variantId = v7();
        const variant = await this.variantRepo.findByCond({
          name: attribute.name,
        });
        if (!variant) {
          await this.variantRepo.insert({
            id: variantId,
            name: attribute.name,
          } as CreationAttributes<Variant>);
        } else {
          variantId = variant.id;
        }

        let variantItemId = v7();
        const variantItem = await this.variantItemRepo.findByCond({
          variantId: variantId,
          value: attribute.value,
          status: ModelStatus.ACTIVE,
        });
        if (!variantItem) {
          await this.variantItemRepo.insert({
            id: variantItemId,
            variantId: variantId,
            value: attribute.value,
            status: ModelStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as CreationAttributes<VariantItem>);
        } else {
          variantItemId = variantItem.id;
        }
        variantItemIds.push(variantItemId);
      }

      return {
        variantItemIds,
        success: true,
      };
    } catch (error) {
      console.error(
        '[ERROR] ********** upsertVariants error:',
        error.response?.data || error.message,
      );
      return {
        variantItemIds: [],
        success: false,
        error: error as Error,
      };
    }
  }

  async updateProductVariants(
    productId: string,
    productItemId: string,
    variantItemIds: Array<string>,
  ): Promise<boolean> {
    try {
      const currentVariants = await this.productItemVariantRepo.findAll({
        productItemId: productItemId,
      });
      const unusedVariants = currentVariants.filter(
        (item) => !variantItemIds.includes(item.variantItemId),
      );

      for (const variantItemId of variantItemIds) {
        const productVariant = await this.productItemVariantRepo.findByCond({
          productItemId,
          variantItemId,
        });
        if (!productVariant) {
          await this.productItemVariantRepo.insert({
            id: v7(),
            productId: productId,
            productItemId: productItemId,
            variantItemId: variantItemId,
            status: ModelStatus.ACTIVE,
            createdAt: new Date(),
            updatedAt: new Date(),
          } as CreationAttributes<ProductItemVariant>);
        }
      }

      for (const unusedItem of unusedVariants) {
        await this.productItemVariantRepo.delete(unusedItem.id, true);
      }

      return true;
    } catch (error) {
      console.error(
        '[ERROR] ********** updateProductVariants error:',
        error.response?.data || error.message,
      );
      return false;
    }
  }

  async deleteByProductItemId(
    id: string,
    isHardDelete: boolean,
  ): Promise<boolean> {
    return this.productItemVariantRepo.deleteByProductItemId(id, isHardDelete);
  }
}
