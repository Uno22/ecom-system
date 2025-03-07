import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  IProductItemRepository,
  IProductItemService,
} from './product-item.interface';
import { PagingDto } from 'src/share/dto';
import { IListEntity, IOrderMessage } from 'src/share/interfaces';
import {
  CreateProductItemDto,
  CondProductItemDto,
  UpdateProductItemDto,
  ListProductItemByIdsDto,
  ReserveProductItemOrderDto,
} from './dto';
import { ProductItem } from './model/product-item.model';
import { PRODUCT_ITEM_REPOSITORY } from './product-item.di-token';
import {
  PRODUCT_BRAND_RPC,
  PRODUCT_CATEGORY_RPC,
  PRODUCT_CONSUMER,
  PRODUCT_PRODUCER,
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
  CustomConflictException,
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
import { ModelStatus, OrderStatus } from 'src/share/constants/enum';
import { Sequelize } from 'sequelize-typescript';
import { ProductProducer } from '../product/kafka/product.producer';
import { ProductConsumer } from '../product/kafka/product.consumer';
import { KafkaConsumerConfig } from 'src/share/kafka/kafka.constants';
import { RedisService } from 'src/share/cache/redis.service';
import { REDIS_SERVER } from 'src/share/constants/di-token';
import { get } from 'lodash';

@Injectable()
export class ProductItemService implements IProductItemService, OnModuleInit {
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
    @Inject(PRODUCT_PRODUCER)
    private readonly productProducer: ProductProducer,
    @Inject(PRODUCT_CONSUMER)
    private readonly productConsumer: ProductConsumer,
    @Inject(REDIS_SERVER) private readonly redisService: RedisService,
    private readonly sequelize: Sequelize,
  ) {}

  async onModuleInit() {
    const { reserveProduct, deductProduct, releaseProduct } =
      KafkaConsumerConfig.product;
    await this.productConsumer.init([
      {
        groupId: reserveProduct.groupId,
        topic: reserveProduct.topic,
        cb: this.handleReserveProduct.bind(this),
      },
      {
        groupId: deductProduct.groupId,
        topic: deductProduct.topic,
        cb: this.handleDeductProduct.bind(this),
      },
      {
        groupId: releaseProduct.groupId,
        topic: releaseProduct.topic,
        cb: this.handleReleaseProduct.bind(this),
      },
    ]);
  }

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

    const transaction = await this.sequelize.transaction();
    try {
      const createdData = await this.productItemRepo.insert(newEntity as any, {
        transaction,
      });

      await transaction.commit();

      return createdData;
    } catch (error) {
      console.error('[ERROR] ********** product item create error', error);
      await transaction.rollback();
      return null;
    }
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

  async reserveProductItemDuringOrderCreation(
    payload: ReserveProductItemOrderDto,
  ): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      const updatedRows = await this.productItemRepo.reserveProductItems(
        payload.productItems,
        transaction,
      );

      if (updatedRows.some(([rows]) => rows === 0)) {
        throw new CustomConflictException(
          'Some products do not have enough quantity',
          'PRODUCT_INSUFFICIENT_QUANTITY',
        );
      }

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async handleReserveProduct(message: IOrderMessage) {
    const { orderId, userId, productItems } = message;

    const transaction = await this.sequelize.transaction();

    try {
      const mappedProductItems = productItems.map((product) => ({
        productItemId: product.id,
        reserveQuantity: product.quantity,
      }));

      const updatedRows = await this.productItemRepo.reserveProductItems(
        mappedProductItems,
        transaction,
      );

      if (updatedRows.some(([rows]) => rows === 0)) {
        throw new CustomConflictException(
          'Some products do not have enough quantity',
          'PRODUCT_INSUFFICIENT_QUANTITY',
        );
      }

      await transaction.commit();

      const ids = productItems.map(({ id }) => id);
      const productItemsInDB = await this.productItemRepo.findByIds(ids);
      const newProductItems = productItems.map(({ id, quantity }) => {
        const findProduct = productItemsInDB.find(
          (product) => product.id === id,
        );

        return {
          id,
          quantity,
          name: get(findProduct, 'name', ''),
          salePrice: get(findProduct, 'salePrice', 0),
        };
      });

      await this.productProducer.reservedProduct({
        ...message,
        status: OrderStatus.REJECTED,
        productItems: newProductItems,
      });
    } catch (error) {
      console.error('[ERROR] ****** handleReserveProduct error', error);

      await transaction.rollback();

      await this.redisService.setOrder(orderId, {
        userId,
        orderId,
        status: OrderStatus.REJECTED,
        productItems: productItems,
        message: error.message,
      });

      // await this.productProducer.reserveProductFailed({
      //   ...message,
      //   status: OrderStatus.REJECTED,
      //   message: error.message,
      // });
    }
  }

  async handleReleaseProduct(message: IOrderMessage) {
    await this.releaseProduct(message);
  }

  async handleDeductProduct(message: IOrderMessage) {
    const { orderId, userId, productItems } = message;

    const transaction = await this.sequelize.transaction();

    try {
      const mappedProductItems = productItems.map((product) => ({
        productItemId: product.id,
        reserveQuantity: product.quantity,
      }));

      const updatedRows = await this.productItemRepo.deductProductItems(
        mappedProductItems,
        transaction,
      );

      if (updatedRows.some(([rows]) => rows === 0)) {
        throw new CustomConflictException(
          `Failed to deduct product items. It may not exist or is already at minimum quantity or reservation.`,
          'PRODUCT_DEDUCT_FAILED',
        );
      }

      await transaction.commit();

      await Promise.all([
        this.productProducer.deductedProduct(message),
        this.redisService.setOrder(orderId, {
          userId,
          orderId,
          status: OrderStatus.CONFIRMED,
          productItems: productItems,
        }),
      ]);

      return true;
    } catch (error) {
      console.error('[ERROR] ****** handleDeductProduct error', error);

      await transaction.rollback();

      await Promise.all([
        this.productProducer.deductProductFailed(message),
        this.releaseProduct(message),
        this.redisService.setOrder(orderId, {
          userId,
          orderId,
          status: OrderStatus.CANCELED,
          productItems: productItems,
          message: error.message,
        }),
      ]);

      return false;
    }
  }

  async releaseProduct(message: IOrderMessage) {
    const { productItems } = message;

    const transaction = await this.sequelize.transaction();

    try {
      const mappedProductItems = productItems.map((product) => ({
        productItemId: product.id,
        reserveQuantity: product.quantity,
      }));

      const updatedRows = await this.productItemRepo.releaseProductItems(
        mappedProductItems,
        transaction,
      );

      if (updatedRows.some(([rows]) => rows === 0)) {
        throw new CustomConflictException(
          `Failed to release product items. It may not exist or is already at minimum reservation.`,
          'PRODUCT_RELEASE_FAILED',
        );
      }

      await transaction.commit();

      return true;
    } catch (error) {
      console.error('[ERROR] ****** releaseProduct error', error);

      await transaction.rollback();

      await this.productProducer.sendDLQMessage({
        ...message,
        message: 'Failed to release product items',
      });

      return false;
    }
  }
}
