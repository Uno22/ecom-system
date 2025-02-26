import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class UserLoginDto extends PickType(UserDto, ['email', 'password']) {}
