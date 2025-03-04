import { IRepository, IService } from 'src/share/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CondCategoryDto } from './dto/cond-category.dto';
import { Category } from './model/category.model';

export interface ICategoryService
  extends IService<
    Category,
    CreateCategoryDto,
    UpdateCategoryDto,
    CondCategoryDto
  > {}

export interface ICategoryRepository
  extends IRepository<Category, UpdateCategoryDto, CondCategoryDto> {}
