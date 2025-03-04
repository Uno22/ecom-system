import { PickType } from '@nestjs/swagger';
import { VariantDto, VariantItemDto } from './variant.dto';

export class CreateVariantDto extends PickType(VariantDto, ['name'] as const) {}

export class CreateVariantItemDto extends PickType(VariantItemDto, [
  'variantId',
  'value',
] as const) {}
