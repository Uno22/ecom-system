import { IsOptional, IsUUID } from 'class-validator';

export class CondProductItemVariantDto {
  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  @IsOptional()
  productItemId?: string;

  @IsUUID()
  @IsOptional()
  variantItemId?: string;
}
