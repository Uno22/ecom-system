import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class InternalUnauthorizedException extends ApiException {
  constructor() {
    super('Invalid internal token', 'TOKEN_INVALID', HttpStatus.UNAUTHORIZED);
  }
}
