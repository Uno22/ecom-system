import { PagingDto } from 'src/share/dto';
import { IListEntity, IRepository } from 'src/share/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CondCategoryDto } from './dto/cond-category.dto';
import { Category } from './model/category.model';

export interface ICategoryService {
  create(data: CreateCategoryDto): Promise<Category | null>;
  findOne(id: string): Promise<Category | null>;
  findAll(
    cond: CondCategoryDto,
    paging: PagingDto,
  ): Promise<IListEntity<Category>>;
  update(id: string, data: UpdateCategoryDto): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface ICategoryRepository
  extends IRepository<Category, UpdateCategoryDto, CondCategoryDto> {}
