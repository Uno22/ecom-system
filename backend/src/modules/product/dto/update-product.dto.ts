import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { ProductDto } from './product.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto extends PickType(ProductDto, [
  'description',
] as const) {
  @ApiPropertyOptional({
    example: 'Iphone 15',
    description: 'The name of product',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
