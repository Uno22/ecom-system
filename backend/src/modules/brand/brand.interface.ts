import { IRepository, IService } from 'src/share/interface';
import { CreateBrandDto, UpdateBrandDto, CondBrandDto } from './dto';
import { Brand } from './model/brand.model';

export interface IBrandService
  extends IService<CreateBrandDto, UpdateBrandDto, Brand, CondBrandDto> {}

export interface IBrandRepository
  extends IRepository<Brand, UpdateBrandDto, CondBrandDto> {}
