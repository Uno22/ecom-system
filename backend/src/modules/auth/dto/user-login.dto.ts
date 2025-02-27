import { PickType } from '@nestjs/swagger';
import { UserDto } from 'src/share/dto/user.dto';

export class UserLoginDto extends PickType(UserDto, ['email', 'password']) {}
