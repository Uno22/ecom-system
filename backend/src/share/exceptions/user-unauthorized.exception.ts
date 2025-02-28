import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserUnauthorizedException extends ApiException {
  constructor() {
    super(
      'You must be logged in to access this resource.',
      'UNAUTHORIZED',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
