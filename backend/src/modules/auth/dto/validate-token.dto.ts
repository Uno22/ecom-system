import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Access token' })
  token: string;
}
