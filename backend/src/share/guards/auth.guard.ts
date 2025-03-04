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
import { UserInactivatedStatus } from '../constants/enum';
import { UserInactivatedException } from '../exceptions/user-inactivated.exception';

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

    if (UserInactivatedStatus.includes(user.status)) {
      throw new UserInactivatedException();
    }

    request.user = { sub: user.id, role: user.role };
    return true;
  }
}
