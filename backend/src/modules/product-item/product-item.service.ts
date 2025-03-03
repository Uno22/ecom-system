import { Inject, Injectable } from '@nestjs/common';
import {
  IProductItemRepository,
  IProductItemService,
} from './product-item.interface';
import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';
import {
  ValidateAndReserveProductItemDto,
  FinalizeOrderDto,
  CreateProductItemDto,
  CondProductItemDto,
  UpdateProductItemDto,
  ListProductItemByIdsDto,
} from './dto';
import { ProductItem } from './model/product-item.model';
import { PRODUCT_ITEM_REPOSITORY } from './product-item.di-token';
import {
  PRODUCT_BRAND_RPC,
  PRODUCT_CATEGORY_RPC,
  PRODUCT_REPOSITORY,
} from '../product/product.di-token';
import {
  IProductBrandRpc,
  IProductCategoryRpc,
  IProductRepository,
} from '../product/product.interface';
import { VARIANT_SERVICE } from '../variant/variant.di-token';
import { IVariantService } from '../variant/variant.interface';
import {
  DataDuplicatedException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { Op } from 'sequelize';
import { ProductItemVariant } from '../product-item-variant/product-item-variant.model';
import { Product } from '../product/model/product.model';
import { VariantItem } from '../variant/model/variant-item.model';
import { Variant } from '../variant/model/variant.model';
import {
  formatAttributes,
  isAttributesDuplicateValue,
  isProductItemDuplicateWithAttributes,
} from './product-item.utils';
import { AttributeDuplicatedException } from 'src/share/exceptions/attribute-duplicate.exception';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';
import { includes } from 'lodash';
import { raw } from 'mysql2';

@Injectable()
export class ProductItemService implements IProductItemService {
  constructor(
    @Inject(PRODUCT_ITEM_REPOSITORY)
    private readonly productItemRepo: IProductItemRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepo: IProductRepository,
    @Inject(VARIANT_SERVICE)
    private readonly variantService: IVariantService,
    @Inject(PRODUCT_BRAND_RPC)
    private readonly productBrandRepo: IProductBrandRpc,
    @Inject(PRODUCT_CATEGORY_RPC)
    private readonly productCategoryRepo: IProductCategoryRpc,
  ) {}

  async create(data: CreateProductItemDto): Promise<ProductItem | null> {
    const { productId, sku } = data;

    if (isAttributesDuplicateValue(data.attributes || [])) {
      throw new AttributeDuplicatedException();
    }

    if (sku) {
      const productItem = await this.productItemRepo.findByCond({ sku });
      if (productItem) {
        throw new DataDuplicatedException();
      }
    }

    if (productId) {
      const product = await this.productRepo.get(productId);
      if (!product) {
        throw new DataNotFoundException('Product not found');
      }

      // override category id and brand id if found product id
      data.categoryId = product.categoryId;
      data.brandId = product.brandId;

      // check duplicate product item for the same attributes
      const attributes = data.attributes || [];
      if (attributes.length > 0) {
        const { data: currentProductItems } = await this.productItemRepo.list(
          {
            productId: productId,
          },
          {} as any,
          {
            type: 'all',
            include: [
              {
                model: ProductItemVariant,
                attributes: [['variant_item_id', 'variantItemId']],
                include: [
                  {
                    model: VariantItem,
                    attributes: [['variant_id', 'variantId']],
                  },
                ],
              },
            ],
            raw: false,
          },
        );

        const isDuplicated = isProductItemDuplicateWithAttributes(
          attributes,
          currentProductItems,
        );
        if (isDuplicated) {
          throw new DataDuplicatedException();
        }
      }
    }

    const { categoryId, brandId } = data;
    const [category, brand] = await Promise.all([
      this.productCategoryRepo.get(categoryId),
      this.productBrandRepo.get(brandId),
    ]);
    if (!category) {
      throw new DataNotFoundException('Category not found');
    }
    if (!brand) {
      throw new DataNotFoundException('Brand not found');
    }

    const newEntity = {
      ...data,
      reservedQuantity: 0,
      id: v7(),
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
      attributes: data.attributes,
    };

    return this.productItemRepo.insert(newEntity as any);
  }

  async findOne(id: string, options?: object): Promise<ProductItem | null> {
    const data = await this.productItemRepo.get(id, options);
    if (!data || data.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }
    return data;
  }

  async findAll(
    cond: CondProductItemDto,
    paging: PagingDto,
  ): Promise<IListEntity<ProductItem>> {
    if (cond.name) {
      cond['name'] = { [Op.regexp]: cond.name } as any;
    }

    const result = await this.productItemRepo.list(cond, paging, {
      include: [
        {
          model: Product,
          attributes: ['id', 'name'],
        },
        {
          model: ProductItemVariant,
          attributes: [['variant_item_id', 'variantItemId']],
          include: [
            {
              model: VariantItem,
              attributes: [['variant_id', 'variantId'], 'value'],
              include: [
                {
                  model: Variant,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
      raw: false,
    });

    result.data.forEach((data: ProductItem) => formatAttributes(data));

    return result;
  }

  update(id: string, data: UpdateProductItemDto): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  remove(id: string, isHardDelete: boolean): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async listByIds(
    payload: ListProductItemByIdsDto,
  ): Promise<Array<ProductItem>> {
    const { ids, attributes } = payload;
    const queryCond = { id: { [Op.in]: ids } } as any;
    const paging = {
      page: 1,
      limit: ids.length,
    };

    const result = await this.productItemRepo.list(queryCond, paging, {
      ...(attributes && {
        attributes,
      }),
      include: [
        {
          model: ProductItemVariant,
          attributes: [['variant_item_id', 'variantItemId']],
          include: [
            {
              model: VariantItem,
              attributes: [['variant_id', 'variantId'], 'value'],
              include: [
                {
                  model: Variant,
                  attributes: ['name'],
                },
              ],
            },
          ],
        },
      ],
      raw: false,
    });

    result.data.forEach((data: ProductItem) => formatAttributes(data));

    return result.data;
  }

  listyByProductId(id: string): Promise<Array<ProductItem>> {
    throw new Error('Method not implemented.');
  }
  validateAndReserve(
    payload: ValidateAndReserveProductItemDto,
  ): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  finalizeOrder(data: FinalizeOrderDto): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
