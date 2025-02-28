import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CondCategoryDto {
  @ApiPropertyOptional({
    example: 'Table',
    description: 'The name of category',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
