import { Module, Provider } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { BrandRepository } from './infras/brand.repo';
import { BRAND_SERVICE, BRAND_REPOSITORY } from './brand.di-token';
import { Brand } from './model/brand.model';
import { SequelizeModule } from '@nestjs/sequelize';

const dependencies: Provider[] = [
  { provide: BRAND_SERVICE, useClass: BrandService },
  { provide: BRAND_REPOSITORY, useClass: BrandRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [...dependencies],
})
export class BrandModule {}
