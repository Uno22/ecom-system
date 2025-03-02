import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ModelStatic } from 'sequelize';
import { BaseRepository } from 'src/share/infras/base.repo';
import { UpdateVariantItemDto, CondVariantItemDto } from '../dto';
import { VariantItem } from '../model/variant-item.model';

@Injectable()
export class VariantItemRepository extends BaseRepository<
  VariantItem,
  UpdateVariantItemDto,
  CondVariantItemDto
> {
  constructor(@InjectModel(VariantItem) model: ModelStatic<VariantItem>) {
    super(model);
  }
}
