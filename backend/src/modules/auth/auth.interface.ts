import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/model/user.model';
import { LoginReponseDto } from './dto/login-response.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { TokenPayload } from 'src/share/interfaces';

export interface IAuthService {
  register(createUserDto: CreateUserDto): Promise<User | null>;
  login(userLoginDto: UserLoginDto): Promise<LoginReponseDto>;
  logout(token: string): Promise<boolean>;
  validateToken(token: string): Promise<TokenPayload>;
}
