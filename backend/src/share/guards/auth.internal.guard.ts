import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InternalUnauthorizedException } from '../exceptions';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthInternalGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization;

    if (token !== this.config.get<string>('token.masterToken')) {
      throw new InternalUnauthorizedException();
    }

    return true;
  }
}
