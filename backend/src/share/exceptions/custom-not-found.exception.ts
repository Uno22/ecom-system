import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class CustomNotFoundException extends ApiException {
  constructor(
    message: string = 'Data not found',
    errorCode: string = 'NOT_FOUND',
  ) {
    super(message, errorCode, HttpStatus.NOT_FOUND);
  }
}
