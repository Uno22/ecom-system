import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';
import { Type } from 'class-transformer';
import { ProductItemDto } from '../../product-item/dto/product-item.dto';

export class ProductDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of category',
  })
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338b',
    description: 'The id of brand',
  })
  @IsUUID()
  @IsNotEmpty()
  brandId: string;

  @ApiProperty({
    example: 'Iphone 15 Pro Max',
    description: 'The name of product',
  })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'The description of product',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of product',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductItemDto)
  @IsOptional()
  productItems?: ProductItemDto[];
}
