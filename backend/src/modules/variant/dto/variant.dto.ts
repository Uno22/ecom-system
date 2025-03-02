import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';

export class VariantDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'color', description: 'The name of variant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  variantItems?: object[];
}

export class VariantItemDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant item',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of variant',
  })
  @IsUUID()
  @IsNotEmpty()
  variantId: string;

  variant?: VariantDto;

  @ApiProperty({
    example: 'gold',
    description: 'The value of variant item',
  })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of variant item',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;
}
