import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class InvalidTokenException extends ApiException {
  constructor() {
    super('Invalid or expired token', 'TOKEN_INVALID', HttpStatus.UNAUTHORIZED);
  }
}
