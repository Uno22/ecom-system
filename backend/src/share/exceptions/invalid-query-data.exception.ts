import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class InvalidQueryDataException extends ApiException {
  constructor() {
    super('Invalid data in query', 'QUERY_INVALID', HttpStatus.BAD_REQUEST);
  }
}
