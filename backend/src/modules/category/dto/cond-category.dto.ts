import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CondCategoryDto {
  @ApiProperty({ example: 'Table', description: 'The name of category' })
  @IsString()
  @IsOptional()
  name?: string;
}
