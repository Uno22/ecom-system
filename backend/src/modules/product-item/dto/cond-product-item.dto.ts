import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CondProductItemDto {
  @ApiPropertyOptional({
    example: 'Iphone 15 Pro Max 64G gold',
    description: 'The name of product item',
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product',
  })
  @IsUUID()
  @IsOptional()
  productId?: string;

  @ApiPropertyOptional({
    example: 'sku',
    description: 'The stock keep unit of product',
  })
  @IsString()
  @IsOptional()
  sku?: string;
}
