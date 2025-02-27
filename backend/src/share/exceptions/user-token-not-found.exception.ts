import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserTokenNotFoundException extends ApiException {
  constructor() {
    super('User Token not found', 'USER_TOKEN_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
