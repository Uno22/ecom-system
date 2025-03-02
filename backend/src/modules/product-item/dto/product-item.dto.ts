import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ProductDto } from '../../product/dto/product.dto';
import { Type } from 'class-transformer';
import { ModelStatus } from 'src/share/constants/enum';
import { UUID } from 'sequelize';
import { ProductItemVariantDto } from 'src/modules/product-item-variant/dto';

export class ProductItemAttributeDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant',
  })
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant item',
  })
  @IsUUID()
  @IsNotEmpty()
  variantItemId: string;

  @ApiPropertyOptional({
    example: 'color',
    description: 'The color name of product item',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'gold',
    description: 'The color value of product item',
  })
  @IsString()
  @IsOptional()
  value?: string;
}

export class SimpleProductDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'iphone 15',
    description: 'The name of product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class ProductItemDto {
  @ApiProperty({
    example: '019300e9-e38c-7116-9453-95be899c12f2',
    description: 'The id of product',
  })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    example: { id: '01954067-e76c-7864-ac12-de61732b338a', name: 'Iphone 15' },
    description: 'The id of product',
  })
  @Type(() => SimpleProductDto)
  @IsOptional()
  product?: SimpleProductDto;

  @ApiProperty({
    example: '019300b8-5bb8-755b-a7ff-fe21b767b59a',
    description: 'The id of category',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: '019300b1-7aec-7ff6-ad90-11be3cce1fde',
    description: 'The id of brand',
  })
  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemVariantDto)
  @IsOptional()
  variantItems?: ProductItemVariantDto[];

  @ApiProperty({
    example: 'Iphone 15 Pro Max 64G gold',
    description: 'The name of product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 25000000,
    description: 'The price of product item',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.0)
  @Max(99999999.99)
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 20000000,
    description: 'The sale price of product item',
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999999.99)
  @IsNotEmpty()
  salePrice: number;

  @ApiProperty({
    example: 0,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({
    description:
      'The reserved quantity when customer place order but not finish payment yet',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  reservedQuantity?: number;

  @ApiProperty({
    example: 'sku0192929202',
    description: 'The sku of product item',
  })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({
    example: 'content',
    description: 'The content of product item',
  })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    example: 'description',
    description: 'The description of product item',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '4.5',
    description: 'The description of product item',
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({
    example: 0,
    description: 'The sale count of product item',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  saleCount?: number;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of product item',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;

  @ApiPropertyOptional({
    example: [
      {
        variantId: '01930526-e8c7-7aab-b19c-f3eaf8d7acb7',
        variantItemId: '01930526-e8e1-7aab-b19d-0a31710c3f8c',
      },
      {
        variantId: '01930526-e8c7-7aab-b19c-f9c54b7c01a8',
        variantItemId: '01930526-e8e9-7aab-b19d-15dd31997ada',
      },
    ],
    description: 'The attributes of product item',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemAttributeDto)
  @IsOptional()
  attributes?: ProductItemAttributeDto[];
}

export class ReserveProductItemDto {
  @IsString()
  @IsUUID()
  productItemId: string;

  @IsNumber()
  @Min(1)
  reserveQuantity: string;
}

export class ValidateAndReserveProductItemDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReserveProductItemDto)
  items: ReserveProductItemDto[];
}

export class FinalizeOrderDto extends ValidateAndReserveProductItemDto {}

export class ListProductItemByIdDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UUID)
  ids: string[];
}
