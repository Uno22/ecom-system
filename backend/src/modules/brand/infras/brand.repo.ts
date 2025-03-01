import { Injectable } from '@nestjs/common';
import { Brand } from '../model/brand.model';
import { InjectModel } from '@nestjs/sequelize';
import { CondBrandDto, UpdateBrandDto } from '../dto';
import { ModelStatic } from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';

@Injectable()
export class BrandRepository extends BaseRepository<
  Brand,
  UpdateBrandDto,
  CondBrandDto
> {
  constructor(@InjectModel(Brand) model: ModelStatic<Brand>) {
    super(model);
  }
}
