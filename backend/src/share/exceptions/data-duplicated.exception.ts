import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class DataDuplicatedException extends ApiException {
  constructor() {
    super('Data already exists', 'DATA_INVALID', HttpStatus.BAD_REQUEST);
  }
}
