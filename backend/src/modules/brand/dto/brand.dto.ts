import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { ModelStatus } from 'src/share/model/enum';

export class BrandDto extends CreateBrandDto {
  @ApiProperty({ example: 1, description: 'The id of brand' })
  id: number;

  @ApiProperty({
    example: ModelStatus.ACTIVE,
    description: 'The status of brand',
  })
  status: ModelStatus;
}
