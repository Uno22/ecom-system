import { Module, Provider } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './model/product.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PRODUCT_REPOSITORY, PRODUCT_SERVICE } from './product.di-token';
import { ProductRepository } from './infras/product.repo';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: PRODUCT_SERVICE, useClass: ProductService },
  { provide: PRODUCT_REPOSITORY, useClass: ProductRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([Product]), SharedModule],
  controllers: [ProductController],
  providers: [...dependencies],
})
export class ProductModule {}
