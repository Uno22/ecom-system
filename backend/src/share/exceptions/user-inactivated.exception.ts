import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class UserInactivatedException extends ApiException {
  constructor() {
    super('User inactivated', 'USER_INACTIVATED', HttpStatus.BAD_REQUEST);
  }
}
