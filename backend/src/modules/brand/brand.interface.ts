import { IListEntity, IRepository } from 'src/share/interfaces';
import { CreateBrandDto, UpdateBrandDto, CondBrandDto } from './dto';
import { Brand } from './model/brand.model';
import { PagingDto } from 'src/share/dto';
import { CreationAttributes } from 'sequelize';

export interface IBrandService {
  create(data: CreateBrandDto): Promise<Brand | null>;
  findOne(id: string): Promise<Brand | null>;
  findAll(cond: CondBrandDto, paging: PagingDto): Promise<IListEntity<Brand>>;
  update(id: string, data: UpdateBrandDto): Promise<boolean>;
  remove(id: string, isHardDelete: boolean): Promise<boolean>;
}

export interface IBrandRepository
  extends IRepository<Brand, UpdateBrandDto, CondBrandDto> {}
