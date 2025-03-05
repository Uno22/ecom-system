import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { USER_SERVICE } from 'src/modules/user/user.di-token';
import { IUserService } from 'src/modules/user/user.interface';
import {
  InvalidTokenException,
  UserTokenNotFoundException,
  UserUnauthorizedException,
} from '../exceptions';
import { UserInactivatedStatus } from '../constants/enum';
import { UserInactivatedException } from '../exceptions/user-inactivated.exception';
import { JwtService } from '../jwt/jwt.service';
import { RedisService } from '../cache/redis.service';
import { JWT_SERVICE, REDIS_SERVER } from '../constants/di-token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(JWT_SERVICE) private readonly jwtService: JwtService,
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(REDIS_SERVER) private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new InvalidTokenException();
    }

    const decodedToken = this.jwtService.verifyAccessToken(token);
    if (!decodedToken) {
      throw new InvalidTokenException();
    }

    const userId = decodedToken.sub;

    const cachedAccessToken = await this.redisService.getToken(userId);
    if (!cachedAccessToken) {
      throw new InvalidTokenException();
    }

    let userInfo: any = await this.redisService.getUserInfo(userId);

    if (!userInfo) {
      const user = await this.userService.findOne(userId);

      if (!user) {
        throw new UserTokenNotFoundException();
      }

      const payload = this.userService.generatePayload(user);

      await this.redisService.setUserInfo(user.id, payload);

      userInfo = payload;
    } else {
      try {
        userInfo = JSON.parse(userInfo || '');
      } catch (error) {
        throw new UserUnauthorizedException('User unauthorized in cache');
      }
    }

    if (UserInactivatedStatus.includes(userInfo.status)) {
      throw new UserInactivatedException();
    }

    if (decodedToken.role !== userInfo.role) {
      throw new UserUnauthorizedException('The role has been changed');
    }

    request.user = userInfo;
    return true;
  }
}
