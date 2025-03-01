import { Module, Provider } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './controllers/brand.controller';
import { BrandRepository } from './infras/brand.repo';
import { BRAND_SERVICE, BRAND_REPOSITORY } from './brand.di-token';
import { Brand } from './model/brand.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { SharedModule } from 'src/share/share.module';
import { BrandInternalController } from './controllers/brand.internal.controller';

const dependencies: Provider[] = [
  { provide: BRAND_SERVICE, useClass: BrandService },
  { provide: BRAND_REPOSITORY, useClass: BrandRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([Brand]), SharedModule],
  controllers: [BrandController, BrandInternalController],
  providers: [...dependencies],
})
export class BrandModule {}
