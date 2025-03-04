import { IRepository, IService } from 'src/share/interfaces';
import { CreateBrandDto, UpdateBrandDto, CondBrandDto } from './dto';
import { Brand } from './model/brand.model';

export interface IBrandService
  extends IService<Brand, CreateBrandDto, UpdateBrandDto, CondBrandDto> {}

export interface IBrandRepository
  extends IRepository<Brand, UpdateBrandDto, CondBrandDto> {}
