import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class DataNotFoundException extends ApiException {
  constructor(message: string = 'Data not found') {
    super(message, 'DATA_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
