import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';

export class ProductItemVariantDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsOptional()
  productId?: string;

  @IsUUID()
  productItemId: string;

  @IsUUID()
  variantItemId: string;

  @IsEnum(ModelStatus)
  status: ModelStatus;
}
