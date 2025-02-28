import { Module, Provider } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CATEGORY_REPOSITORY, CATEGORY_SERVICE } from './category.di-token';
import { CategoryRepository } from './infras/category.repo';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './model/category.model';
import { SharedModule } from 'src/share/share.module';

const dependencies: Provider[] = [
  { provide: CATEGORY_SERVICE, useClass: CategoryService },
  { provide: CATEGORY_REPOSITORY, useClass: CategoryRepository },
];

@Module({
  imports: [SequelizeModule.forFeature([Category]), SharedModule],
  controllers: [CategoryController],
  providers: [...dependencies],
})
export class CategoryModule {}
