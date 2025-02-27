import { ApiResponseDto } from '../dto';
import { TokenPayload } from './interface';

export interface IValidateTokenRPC {
  validateToken(token: string): Promise<ValidateTokenResult>;
}

export type ValidateTokenResult = ApiResponseDto<TokenPayload>;
