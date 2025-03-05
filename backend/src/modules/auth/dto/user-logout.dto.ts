import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UserLogoutDto {
  @ApiProperty({ description: 'The id of user' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
