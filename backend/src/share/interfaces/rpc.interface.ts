import { TokenPayload } from './interface';

export interface IValidateTokenRpc {
  validateToken(token: string): Promise<TokenPayload | null>;
}
