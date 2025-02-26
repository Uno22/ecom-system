import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateBrandDto {
  @ApiPropertyOptional({ example: 'Nokia', description: 'The name of brand' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'https://image.png',
    description: 'The url of image',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'The description of brand',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'phone',
    description: 'The tag line of brand',
  })
  @IsString()
  @IsOptional()
  tagLine?: string;
}
