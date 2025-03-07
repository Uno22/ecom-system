import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './auth.interface';
import { User } from '../user/model/user.model';
import { USER_SERVICE } from '../user/user.di-token';
import { IUserService } from '../user/user.interface';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { LoginReponseDto } from './dto/login-response.dto';
import {
  InvalidEmaipAndPasswordException,
  InvalidTokenException,
  UserTokenNotFoundException,
  UserUnauthorizedException,
} from 'src/share/exceptions';
import { UserInactivatedException } from 'src/share/exceptions/user-inactivated.exception';
import { UserInactivatedStatus } from 'src/share/constants/enum';
import { TokenPayload } from 'src/share/interfaces';
import * as bcrypt from 'bcryptjs';
import { JWT_SERVICE, REDIS_SERVER } from 'src/share/constants/di-token';
import { RedisService } from 'src/share/cache/redis.service';
import { JwtService } from 'src/share/jwt/jwt.service';
import { Response } from 'express';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: IUserService,
    @Inject(REDIS_SERVER) private readonly redisService: RedisService,
    @Inject(JWT_SERVICE) private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User | null> {
    return this.userService.create(createUserDto);
  }

  async login(
    userLoginDto: UserLoginDto,
    res: Response,
  ): Promise<LoginReponseDto> {
    const { email, password } = userLoginDto;
    const user = await this.userService.findByCond({ email }, { raw: false });
    if (!user) {
      throw new InvalidEmaipAndPasswordException();
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new InvalidEmaipAndPasswordException();
    }

    const payload = this.userService.generatePayload(user);

    const accessToken = this.jwtService.generateAccessToken(payload);
    const refreshToken = this.jwtService.generateRefreshToken(payload);

    this.setRefreshTokenCookie(refreshToken, res);
    await Promise.all([
      this.redisService.setToken(user.id, accessToken),
      this.redisService.setUserInfo(user.id, payload),
    ]);

    return {
      accessToken,
    };
  }

  async logout(userId: string, res: Response): Promise<boolean> {
    this.clearRefreshTokenCookie(res);
    await this.redisService.deleteToken(userId);
    await this.redisService.deleteUserInfo(userId);
    return true;
  }

  async validateToken(token: string): Promise<TokenPayload> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verifyAccessToken(token);
      if (!decodedToken) {
        throw new InvalidTokenException();
      }
    } catch (error) {
      console.error('[ERROR] ********** jwt verify token error:', error);
      throw new InvalidTokenException();
    }

    const userId = decodedToken.sub;

    const cachedAccessToken = await this.redisService.getToken(userId);
    if (!cachedAccessToken || cachedAccessToken !== token) {
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

    return userInfo;
  }

  async refreshToken(token: string): Promise<LoginReponseDto> {
    let decodedToken;
    try {
      decodedToken = this.jwtService.verifyRefreshToken(token);
      if (!decodedToken) {
        throw new InvalidTokenException();
      }
    } catch (error) {
      console.error(
        '[ERROR] ********** jwt verify refresh token error:',
        error,
      );
      throw new InvalidTokenException();
    }

    const userId = decodedToken.sub;

    // double check user's status and role
    const user = await this.userService.findOne(userId);

    if (
      !user ||
      user.role !== decodedToken.role ||
      UserInactivatedStatus.includes(user.status)
    ) {
      throw new UserUnauthorizedException('Invalid user, please login again.');
    }

    const payload = this.userService.generatePayload(user);
    const accessToken = this.jwtService.generateAccessToken(payload);

    await Promise.all([
      this.redisService.setToken(userId, accessToken),
      this.redisService.setUserInfo(userId, payload),
    ]);

    return {
      accessToken,
    };
  }

  setRefreshTokenCookie(refreshToken: string, res: Response) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: parseInt(this.jwtService.refreshTokenExpiresIn) * 1000,
      path: '/api/v1/auth/refresh',
    });
  }

  clearRefreshTokenCookie(res: Response) {
    res.clearCookie('refreshToken');
  }
}
