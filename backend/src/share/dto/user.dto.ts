import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender, UserRole, UserStatus } from 'src/share/constants/enum';

export class UserDto {
  @ApiProperty({
    example: '01954067-e76c-7864-ac12-de61732b338a',
    description: 'The id of user',
  })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'first', description: 'The first name of user' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'last', description: 'The last name of user' })
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'user@gamil.com', description: 'The email of user' })
  @IsEmail()
  @MaxLength(50)
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'aEbR196!', description: 'The password of user' })
  @IsStrongPassword(
    {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: 'Password is too weak' },
  )
  @MaxLength(20)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: '0909876510', description: 'The phone of user' })
  @IsString()
  @IsOptional()
  @MinLength(8)
  @MaxLength(20)
  phone?: string;

  @ApiProperty({ example: 'address', description: 'The address of user' })
  @IsString()
  @MaxLength(200)
  @IsOptional()
  address?: string;

  @ApiProperty({
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    description: 'The status of user',
  })
  @IsEnum(UserStatus)
  status: UserStatus;

  @ApiProperty({
    example: 'http://avatar.png',
    description: 'The avatar url of user',
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    enum: UserGender,
    example: UserGender.UNKNOWN,
    description: 'The gender of user',
  })
  @IsEnum(UserGender)
  @IsOptional()
  gender?: UserGender;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'The role of user',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: '1980-01-20', description: 'The birthday of user' })
  @IsDateString(
    {},
    {
      message:
        'Invalid date format. Use ISO 8601 format (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SSZ)',
    },
  )
  @IsOptional()
  birthday?: Date;
}
