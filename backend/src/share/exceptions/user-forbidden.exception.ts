import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserForbiddenException extends ApiException {
  constructor() {
    super(
      'You do not have permission to access this resource.',
      'FORBIDDEN',
      HttpStatus.FORBIDDEN,
    );
  }
}
