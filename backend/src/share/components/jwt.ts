import { ITokenProvider, TokenPayload } from '../interface';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { Injectable } from '@nestjs/common';

@Injectable()
class JwtTokenService implements ITokenProvider {
  constructor(
    private readonly secretKey: string,
    private readonly expiresIn: string | number,
  ) {}

  async generateToken(payload: TokenPayload): Promise<string> {
    return await jwt.sign(payload, this.secretKey, {
      expiresIn: this.expiresIn,
    });
  }
  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = (await jwt.verify(token, this.secretKey)) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

export const jwtProvider = new JwtTokenService(
  config.accessToken.secretKey,
  config.accessToken.expiresIn,
);
