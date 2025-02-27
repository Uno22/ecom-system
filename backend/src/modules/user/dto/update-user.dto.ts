import { OmitType, PartialType } from '@nestjs/swagger';
import { UserDto } from '../../../share/dto/user.dto';

class OmitUpdateUserDto extends OmitType(UserDto, [
  'id',
  'email',
  'password',
]) {}

export class UpdateUserDto extends PartialType(OmitUpdateUserDto) {}
