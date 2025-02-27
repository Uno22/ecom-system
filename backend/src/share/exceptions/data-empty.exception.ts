import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class DataEmptyException extends ApiException {
  constructor() {
    super('Data is empty', 'DATA_EMPTY', HttpStatus.BAD_REQUEST);
  }
}
