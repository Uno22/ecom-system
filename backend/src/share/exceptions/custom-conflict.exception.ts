import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class CustomConflictException extends ApiException {
  constructor(message: string = 'Conflick', errorCode: string = 'CONFLICT') {
    super(message, errorCode, HttpStatus.CONFLICT);
  }
}
