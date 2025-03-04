import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserNotFoundException extends ApiException {
  constructor() {
    super('User not found', 'USER_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
