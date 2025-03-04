import { Module, Provider } from '@nestjs/common';
import { ProductItemVariantService } from './product-item-variant.service';
import { ProductItemVariant } from './product-item-variant.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductItemVariantRepository } from './infras/product-item-variant.repo';
import {
  PRODUCT_ITEM_VARIANT_SERVICE,
  PRODUCT_ITEM_VARIANT_REPOSITORY,
} from './product-item-variant.di-token';

const dependencies: Provider[] = [
  {
    provide: PRODUCT_ITEM_VARIANT_SERVICE,
    useClass: ProductItemVariantService,
  },
  {
    provide: PRODUCT_ITEM_VARIANT_REPOSITORY,
    useClass: ProductItemVariantRepository,
  },
];

@Module({
  imports: [SequelizeModule.forFeature([ProductItemVariant])],
  providers: [...dependencies],
  exports: [PRODUCT_ITEM_VARIANT_REPOSITORY],
})
export class ProductItemVariantModule {}
