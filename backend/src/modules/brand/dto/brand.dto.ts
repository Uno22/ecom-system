import { ApiProperty } from '@nestjs/swagger';
import { CreateBrandDto } from './create-brand.dto';
import { ModelStatus } from 'src/share/constants/enum';
import { IsEnum, IsUUID } from 'class-validator';

export class BrandDto extends CreateBrandDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of brand',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of brand',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;
}
