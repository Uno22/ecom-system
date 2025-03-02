import { Module, Provider } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductItem } from '../product-item/model/product-item.model';
import { ProductItemService } from './product-item.service';
import { ProductItemController } from './product-item.controller';
import {
  PRODUCT_ITEM_REPOSITORY,
  PRODUCT_ITEM_SERVICE,
} from './product-item.di-token';
import { ProductItemRepository } from './infras/product-item.repo';
import { ProductRepository } from '../product/infras/product.repo';
import {
  PRODUCT_BRAND_RPC,
  PRODUCT_CATEGORY_RPC,
  PRODUCT_REPOSITORY,
} from '../product/product.di-token';
import { Product } from '../product/model/product.model';
import { VariantModule } from '../variant/variant.module';
import { ConfigService } from '@nestjs/config';
import { ProductBrandRpc } from '../product/rpc/product-brand.rpc';
import { ProductCategoryRpc } from '../product/rpc/product-category.rpc';
import { ProductItemVariant } from '../product-item-variant/product-item-variant.model';

const dependencies: Provider[] = [
  { provide: PRODUCT_ITEM_SERVICE, useClass: ProductItemService },
  { provide: PRODUCT_ITEM_REPOSITORY, useClass: ProductItemRepository },
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
  {
    provide: PRODUCT_BRAND_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.productBrandBaseUrl', '');
      const token: string = configService.get<string>('token.masterToken', '');
      return new ProductBrandRpc(url, token);
    },
    inject: [ConfigService],
  },
  {
    provide: PRODUCT_CATEGORY_RPC,
    useFactory: (configService: ConfigService) => {
      const url = configService.get<string>('rpc.productCategoryBaseUrl', '');
      const token: string = configService.get<string>('token.masterToken', '');
      return new ProductCategoryRpc(url, token);
    },
    inject: [ConfigService],
  },
];

@Module({
  imports: [
    SequelizeModule.forFeature([ProductItem, Product, ProductItemVariant]),
    VariantModule,
  ],
  controllers: [ProductItemController],
  providers: [...dependencies],
})
export class ProductItemModule {}
