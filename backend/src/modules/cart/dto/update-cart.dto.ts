import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class UpdateCartDto {}

export class UpdateCartItemDto {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    example: '019305be-db14-7776-8bbc-dfd4cfb0f5ed',
    description: 'The id of product item',
  })
  @IsUUID()
  @IsNotEmpty()
  productItemId?: string;

  @ApiProperty({
    example: 1,
    description: 'The quantity of product item',
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  quantity?: number;
}
