import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtService {
  private accessTokenSecretKey;
  private accessTokenExpiresIn;
  private refreshTokenSecretKey;
  public refreshTokenExpiresIn;

  constructor(
    private readonly nestJwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>(
      'jwtToken.accessToken.secretKey',
    );
    this.accessTokenExpiresIn = this.configService.get<string>(
      'jwtToken.accessToken.expiresIn',
    );
    this.refreshTokenSecretKey = this.configService.get<string>(
      'jwtToken.refreshToken.secretKey',
    );
    this.refreshTokenExpiresIn = this.configService.get<string>(
      'jwtToken.refreshToken.expiresIn',
    );
  }

  generateAccessToken(payload: any) {
    return this.nestJwtService.sign(payload, {
      secret: this.accessTokenSecretKey,
      expiresIn: this.accessTokenExpiresIn,
    });
  }

  verifyAccessToken(token: string) {
    return this.nestJwtService.verify(token, {
      secret: this.accessTokenSecretKey,
    });
  }

  generateRefreshToken(payload: any) {
    return this.nestJwtService.sign(payload, {
      secret: this.refreshTokenSecretKey,
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  verifyRefreshToken(token: string) {
    return this.nestJwtService.verify(token, {
      secret: this.refreshTokenSecretKey,
    });
  }

  decodeToken(token: string) {
    return this.nestJwtService.decode(token);
  }
}
