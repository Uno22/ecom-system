import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ErrTokenInvalid } from '../app-error';
import { ITokenIntrospect, IValidateTokenRpc } from '../interfaces';
import { TOKEN_INTROSPECTOR, VALIDATE_TOKEN_RPC } from '../constants/di-token';
import { InvalidTokenException } from '../exceptions';

@Injectable()
export class RemoteAuthGuard implements CanActivate {
  constructor(
    //@Inject(TOKEN_INTROSPECTOR) private readonly introspector: ITokenIntrospect,
    @Inject(VALIDATE_TOKEN_RPC)
    private readonly validateTokenRpc: IValidateTokenRpc,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type !== 'Bearer' || !token) {
      throw new InvalidTokenException();
    }

    const data = await this.validateTokenRpc.validateToken(token);
    if (!data) {
      throw new InvalidTokenException();
    }

    request.user = data;
    return true;
  }
}
