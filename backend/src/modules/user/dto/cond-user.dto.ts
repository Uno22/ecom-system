import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional } from 'class-validator';

export class CondUserDto {
  @ApiProperty({ example: 'user@gamil.com', description: 'The email of user' })
  @IsEmail()
  @IsOptional()
  email: string;
}
