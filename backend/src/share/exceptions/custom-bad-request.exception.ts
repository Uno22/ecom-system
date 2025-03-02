import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class CustomBadRequestException extends ApiException {
  constructor(
    message: string = 'Bad Request',
    errorCode: string = 'BAD_REQUEST',
  ) {
    super(message, errorCode, HttpStatus.BAD_REQUEST);
  }
}
