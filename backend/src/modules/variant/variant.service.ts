import { Inject, Injectable } from '@nestjs/common';
import {
  IVariantItemRepository,
  IVariantRepository,
  IVariantService,
} from './variant.interface';
import {
  VARIANT_ITEM_REPOSITORY,
  VARIANT_REPOSITORY,
} from './variant.di-token';
import { v7 } from 'uuid';
import { ModelStatus } from 'src/share/constants/enum';
import { Variant } from './model/variant.model';
import { CreationAttributes } from 'sequelize';
import { VariantItem } from './model/variant-item.model';
import { CreateVariantDto, CreateVariantItemDto } from './dto';
import { DataDuplicatedException } from 'src/share/exceptions';

@Injectable()
export class VariantService implements IVariantService {
  constructor(
    @Inject(VARIANT_REPOSITORY)
    private readonly variantRepo: IVariantRepository,
    @Inject(VARIANT_ITEM_REPOSITORY)
    private readonly variantItemRepo: IVariantItemRepository,
  ) {}

  async createVariant(data: CreateVariantDto): Promise<Variant | null> {
    data.name = data.name.toLowerCase();

    const isDataExist = await this.variantRepo.findByCond({
      name: data.name,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newData = {
      ...data,
      id: v7(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.variantRepo.insert(newData as CreationAttributes<Variant>);
  }

  async createVariantItem(
    data: CreateVariantItemDto,
  ): Promise<VariantItem | null> {
    data.value = data.value.toLowerCase();

    const isDataExist = await this.variantItemRepo.findByCond({
      variantId: data.variantId,
      value: data.value,
    });

    if (isDataExist) {
      throw new DataDuplicatedException();
    }

    const newData = {
      ...data,
      id: v7(),
      status: ModelStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.variantItemRepo.insert(
      newData as CreationAttributes<VariantItem>,
    );
  }
}
