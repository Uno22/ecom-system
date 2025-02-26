import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserService } from '../user/user.interface';
import { USER_SERVICE } from '../user/user.di-token';

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
      throw new UnauthorizedException();
    }

    const decodedToken = this.jwtService.verify(token);
    if (!decodedToken) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findOne(decodedToken.sub);
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    return true;
    //return Promise.resolve(true);
  }
}
