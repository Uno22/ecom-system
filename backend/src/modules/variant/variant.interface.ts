import { IRepository } from 'src/share/interfaces';
import {
  UpdateVariantDto,
  CondVariantDto,
  CondVariantItemDto,
  UpdateVariantItemDto,
  CreateVariantDto,
  CreateVariantItemDto,
} from './dto';
import { Variant } from './model/variant.model';
import { VariantItem } from './model/variant-item.model';
import { ProductItemAttributeDto } from '../product-item/dto';

export interface IVariantRepository
  extends IRepository<Variant, UpdateVariantDto, CondVariantDto> {}

export interface IVariantItemRepository
  extends IRepository<VariantItem, UpdateVariantItemDto, CondVariantItemDto> {}

export interface IUpsertVariantResult {
  variantItemIds: Array<string>;
  success: boolean;
  error?: Error;
}

export interface IVariantService {
  createVariant(data: CreateVariantDto): Promise<Variant | null>;
  createVariantItem(data: CreateVariantItemDto): Promise<VariantItem | null>;
}
