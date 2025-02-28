import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CondProductDto {
  @ApiPropertyOptional({
    example: 'Iphone 15 Pro Max',
    description: 'The name of category',
  })
  @IsString()
  @IsOptional()
  name?: string | object;
}
