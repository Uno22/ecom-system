import { PickType } from '@nestjs/swagger';
import { ProductItemDto } from './product-item.dto';

export class CreateProductItemDto extends PickType(ProductItemDto, [
  'name',
  'productId',
  'categoryId',
  'brandId',
  'price',
  'salePrice',
  'quantity',
  'sku',
  'content',
  'description',
  'attributes',
] as const) {}
