import { PagingDto } from 'src/share/dto';
import { IListEntity } from 'src/share/interfaces';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { CondCategoryDto } from './dto/cond-category.dto';
import { Category } from './model/category.model';
import { CreationAttributes } from 'sequelize';

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

export interface ICategoryRepository {
  insert(data: CreationAttributes<Category>): Promise<Category | null>;
  update(id: string, data: UpdateCategoryDto): Promise<boolean>;
  delete(id: string, isHardDelete: boolean): Promise<boolean>;
  get(id: string, options?: object): Promise<Category | null>;
  list(
    cond: CondCategoryDto,
    paging: PagingDto,
    options?: object,
  ): Promise<IListEntity<Category>>;
  findByCond(cond: CondCategoryDto): Promise<Category | null>;
}
