import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserUnauthorizedException extends ApiException {
  constructor(message = 'You must be logged in to access this resource.') {
    super(message, 'UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
  }
}
