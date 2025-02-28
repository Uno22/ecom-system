import { Injectable, Inject } from '@nestjs/common';
import { CreationAttributes, Op } from 'sequelize';
import { ModelStatus } from 'src/share/constants/enum';
import { PagingDto } from 'src/share/dto';
import {
  DataDuplicatedException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { IListEntity } from 'src/share/interfaces';
import { validateDataObjectEmpty } from 'src/share/utils/validate';
import { v7 } from 'uuid';
import { CATEGORY_REPOSITORY } from './category.di-token';
import { ICategoryRepository, ICategoryService } from './category.interface';
import { CreateCategoryDto, CondCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from './model/category.model';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepo: ICategoryRepository,
  ) {}

  async create(data: CreateCategoryDto): Promise<Category | null> {
    const isDataExist = await this.categoryRepo.findByCond({
      name: data.name,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const parentId = data.parentId;
    if (parentId) {
      const parent = await this.categoryRepo.get(parentId);
      if (!parent) {
        throw new DataNotFoundException('Parent Category not found');
      }
    }

    const newCategory = {
      ...data,
      id: v7(),
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.categoryRepo.insert(
      newCategory as CreationAttributes<Category>,
    );
  }

  async findOne(id: string): Promise<Category | null> {
    const data = await this.categoryRepo.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }
    return data;
  }

  async findAll(
    cond: CondCategoryDto,
    paging: PagingDto,
  ): Promise<IListEntity<Category>> {
    if (cond.name) {
      cond['name'] = { [Op.regexp]: cond.name } as any;
    }

    return this.categoryRepo.list(cond, paging);
  }

  async update(id: string, data: UpdateCategoryDto): Promise<boolean> {
    validateDataObjectEmpty(data);

    const currentData = await this.categoryRepo.get(id);
    if (!currentData || currentData.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }

    const parentId = data.parentId;
    if (parentId) {
      const parent = await this.categoryRepo.get(parentId);
      if (!parent) {
        throw new DataNotFoundException('Parent Category not found');
      }
    }

    return this.categoryRepo.update(id, data);
  }

  async remove(id: string, isHardDelete: boolean): Promise<boolean> {
    // should up products to default Category or prevent delete if there is any product
    return this.categoryRepo.delete(id, isHardDelete);
  }
}
