import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatic } from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';
import { UpdateVariantDto, CondVariantDto } from '../dto';
import { Variant } from '../model/variant.model';

@Injectable()
export class VariantRepository extends BaseRepository<
  Variant,
  UpdateVariantDto,
  CondVariantDto
> {
  constructor(@InjectModel(Variant) model: ModelStatic<Variant>) {
    super(model);
  }
}
