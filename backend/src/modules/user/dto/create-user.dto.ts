import { PickType } from '@nestjs/swagger';
import { UserDto } from '../../../share/dto/user.dto';

export class CreateUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'email',
  'password',
] as const) {}
