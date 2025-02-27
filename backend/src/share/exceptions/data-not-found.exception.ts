import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class DataNotFoundException extends ApiException {
  constructor() {
    super('Data not found', 'DATA_NOT_FOUND', HttpStatus.NOT_FOUND);
  }
}
