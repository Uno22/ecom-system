import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USER_SERVICE } from 'src/modules/user/user.di-token';
import { IUserService } from 'src/modules/user/user.interface';
import {
  InvalidTokenException,
  UserTokenNotFoundException,
} from '../exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private readonly userService: IUserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new InvalidTokenException();
    }

    const decodedToken = this.jwtService.verify(token);
    if (!decodedToken) {
      throw new InvalidTokenException();
    }

    const user = await this.userService.findOne(decodedToken.sub);
    if (!user) {
      throw new UserTokenNotFoundException();
    }

    request.user = user;
    return true;
  }
}
