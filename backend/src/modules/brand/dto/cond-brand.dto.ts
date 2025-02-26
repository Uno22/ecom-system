import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CondBrandDto {
  @ApiPropertyOptional({ example: 'Nokia', description: 'The name of brand' })
  @IsString()
  @IsOptional()
  name?: string;
}
