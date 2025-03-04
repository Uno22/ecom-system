import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsEnum } from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';

export class CondVariantDto {
  @ApiPropertyOptional({
    example: 'color',
    description: 'The name of variant',
  })
  @IsString()
  @IsOptional()
  name?: string;
}

export class CondVariantItemDto {
  @ApiPropertyOptional({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant',
  })
  @IsUUID()
  @IsOptional()
  variantId?: string;

  @ApiPropertyOptional({
    example: 'gold',
    description: 'The value of variant',
  })
  @IsString()
  @IsOptional()
  value?: string;

  @ApiPropertyOptional({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of variant item',
  })
  @IsEnum(ModelStatus)
  status?: ModelStatus;
}
