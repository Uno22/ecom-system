import { Inject, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './model/brand.model';
import { BRAND_REPOSITORY } from './brand.di-token';
import { IBrandRepository, IBrandService } from './brand.interface';
import { IListEntity } from 'src/share/interfaces';
import { PagingDto } from 'src/share/dto/paging.dto';
import { CondBrandDto } from './dto';
import { AppError } from 'src/share/app-error';
import { ModelStatus } from 'src/share/constants/enum';
import { ErrDataDuplicated, ErrDataNotFound } from 'src/share/utils/error';
import { v7 } from 'uuid';
import { CreationAttributes, Op } from 'sequelize';
import { validateDataObjectEmpty } from 'src/share/utils/validate';
import {
  DataDuplicatedException,
  DataNotFoundException,
} from 'src/share/exceptions';
import { ApiResponseDto } from 'src/share/dto';

@Injectable()
export class BrandService implements IBrandService {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly repository: IBrandRepository,
  ) {}

  async create(data: CreateBrandDto): Promise<Brand | null> {
    const isDataExist = await this.repository.findByCond({
      name: data.name,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newId = v7();

    const newBrand = {
      ...data,
      id: newId,
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.repository.insert(newBrand as CreationAttributes<Brand>);
  }

  async findOne(id: string): Promise<Brand | null> {
    const data = await this.repository.get(id);
    if (!data || data.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }
    return data;
  }

  async findAll(
    cond: CondBrandDto,
    paging: PagingDto,
  ): Promise<IListEntity<Brand>> {
    if (cond.name) {
      cond['name'] = { [Op.regexp]: cond.name } as any;
    }

    return this.repository.list(cond, paging);
  }

  async update(id: string, data: UpdateBrandDto): Promise<boolean> {
    validateDataObjectEmpty(data);

    const currentData = await this.repository.get(id);
    if (!currentData || currentData.status === ModelStatus.DELETED) {
      throw new DataNotFoundException();
    }

    return this.repository.update(id, data);
  }

  async remove(id: string, isHardDelete: boolean): Promise<boolean> {
    // should up products to default brand or prevent delete if there is any product
    return this.repository.delete(id, isHardDelete);
  }
}
