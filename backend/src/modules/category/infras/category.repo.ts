import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatic } from 'sequelize';
import { UpdateCategoryDto } from '../dto';
import { CondCategoryDto } from '../dto/cond-category.dto';
import { Category } from '../model/category.model';
import { BaseRepository } from 'src/share/infras/base.repo';

@Injectable()
export class CategoryRepository extends BaseRepository<
  Category,
  UpdateCategoryDto,
  CondCategoryDto
> {
  constructor(@InjectModel(Category) model: ModelStatic<Category>) {
    super(model);
  }
}
