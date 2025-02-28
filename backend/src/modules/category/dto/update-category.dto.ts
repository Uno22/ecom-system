import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { CategoryDto } from './category.dto';
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto extends PickType(CategoryDto, [
  'image',
  'description',
  'parentId',
  'position',
] as const) {
  @ApiPropertyOptional({
    example: 'Table',
    description: 'The name of category',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
