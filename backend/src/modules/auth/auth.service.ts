import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { User } from '../user/model/user.model';
import { USER_SERVICE } from '../user/user.di-token';
import { IUserService } from '../user/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginReponseDto } from './dto/login-response.dto';
import { JwtService } from '@nestjs/jwt';
import {
  InvalidEmaipAndPasswordException,
  InvalidTokenException,
  UserNotFoundException,
} from 'src/share/exceptions';
import { UserInactivatedException } from 'src/share/exceptions/user-inactivated.exception';
import { UserInactivatedStatus, UserRole } from 'src/share/constants/enum';
import { TokenPayload } from 'src/share/interfaces';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User | null> {
    return this.userService.create(createUserDto);
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginReponseDto> {
    const { email, password } = userLoginDto;
    const user = await this.userService.findByCond({ email }, { raw: false });
    if (!user) {
      throw new InvalidEmaipAndPasswordException();
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      throw new InvalidEmaipAndPasswordException();
    }

    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  logout(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  async validateToken(token: string): Promise<TokenPayload> {
    let decodedToken;
    try {
      const decodedToken = this.jwtService.verify(token);
      if (!decodedToken) {
        throw new InvalidTokenException();
      }
    } catch (error) {
      console.error('[ERROR] ********** jwt verify token error:', error);
      throw new InvalidTokenException();
    }

    const user = await this.userService.findOne(decodedToken.sub);
    if (!user) {
      throw new UserNotFoundException();
    }

    if (UserInactivatedStatus.includes(user.status)) {
      throw new UserInactivatedException();
    }

    return { sub: user.id, role: user.role as UserRole };
  }
}
