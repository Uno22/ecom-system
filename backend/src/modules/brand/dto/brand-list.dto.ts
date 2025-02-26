import { ApiProperty } from '@nestjs/swagger';
import { BrandDto } from './brand.dto';

export class BrandListDto {
  @ApiProperty({ example: 10, description: 'Total number of brands' })
  total: number;

  @ApiProperty({ type: [BrandDto], description: 'List of brands' })
  data: BrandDto[];
}
