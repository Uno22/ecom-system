import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '../../../share/dto/user.dto';

class OmitUpdateUserDto extends OmitType(UserDto, [
  'id',
  'email',
  'password',
  'status',
]) {}

export class UpdateUserDto extends PartialType(OmitUpdateUserDto) {}
