import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class AttributeDuplicatedException extends ApiException {
  constructor() {
    super('Invalid Attributes', 'ATTRIBUTE_DUPLICATED', HttpStatus.BAD_REQUEST);
  }
}
