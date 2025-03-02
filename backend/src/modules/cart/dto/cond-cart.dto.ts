import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CondCartDto {}

export class CondCartItemDto {
  @ApiPropertyOptional({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of cart',
  })
  @IsUUID()
  @IsOptional()
  cartId?: string;

  @ApiPropertyOptional({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsOptional()
  productItemId?: string;
}
