import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nokia', description: 'The name of brand' })
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    example: 'https://image.png',
    description: 'The url of image',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({
    example: 'description',
    description: 'The description of brand',
  })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'phone',
    description: 'The tag line of brand',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  tagLine?: string;
}
