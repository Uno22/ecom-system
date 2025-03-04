import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class InvalidEmaipAndPasswordException extends ApiException {
  constructor() {
    super(
      'Invalid email or password',
      'EMAIL_PASSWORD_INVALID',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
