import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateVariantDto {
  @ApiPropertyOptional({
    example: 'color',
    description: 'The name of variant',
  })
  @IsString()
  @IsOptional()
  name?: string;
}

export class UpdateVariantItemDto {
  @ApiPropertyOptional({
    example: 'gold',
    description: 'The value of variant item',
  })
  @IsString()
  @IsOptional()
  value?: string;
}
