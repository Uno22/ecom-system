import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { IValidateTokenRpc } from '../interfaces';
import { VALIDATE_TOKEN_RPC } from '../constants/di-token';
import { InvalidTokenException } from '../exceptions';

@Injectable()
export class RemoteAuthGuard implements CanActivate {
  constructor(
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
