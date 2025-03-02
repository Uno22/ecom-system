import { Module, Provider } from '@nestjs/common';
import { VariantService } from './variant.service';
import { Variant } from './model/variant.model';
import { VariantItem } from './model/variant-item.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { VariantRepository } from './infras/variant.repo';
import {
  VARIANT_ITEM_REPOSITORY,
  VARIANT_REPOSITORY,
  VARIANT_SERVICE,
} from './variant.di-token';
import { VariantItemRepository } from './infras/variant-item.repo';
import { ProductItemVariantModule } from '../product-item-variant/product-item-variant.module';
import { VariantController } from './variant.controller';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: VARIANT_SERVICE, useClass: VariantService },
  { provide: VARIANT_REPOSITORY, useClass: VariantRepository },
  { provide: VARIANT_ITEM_REPOSITORY, useClass: VariantItemRepository },
];

@Module({
  imports: [
    SequelizeModule.forFeature([Variant, VariantItem]),
    ProductItemVariantModule,
    SharedModule,
  ],
  controllers: [VariantController],
  providers: [...dependencies],
  exports: [VARIANT_SERVICE],
})
export class VariantModule {}
