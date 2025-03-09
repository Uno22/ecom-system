import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ModelStatus } from 'src/share/constants/enum';

export class CategoryDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of category',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'Table', description: 'The name of category' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'https://table.png',
    description: 'The url of image',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    example: '01954afa-5942-7649-be0d-b080ccbf0cc6',
    description: 'The id of parent category',
  })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'The description of category',
  })
  @IsString()
  @MaxLength(50)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 0,
    description: 'The positioni of category',
  })
  @IsNumber()
  @IsOptional()
  position?: number;

  @ApiProperty({
    enum: ModelStatus,
    example: ModelStatus.ACTIVE,
    description: 'The status of category',
  })
  @IsEnum(ModelStatus)
  status: ModelStatus;
}
