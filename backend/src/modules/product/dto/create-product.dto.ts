import { PickType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';

export class CreateProductDto extends PickType(ProductDto, [
  'name',
  'categoryId',
  'brandId',
  'description',
] as const) {}
