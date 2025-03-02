import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class CartCreationFailedException extends ApiException {
  constructor() {
    super(
      'Unable to create a new cart. Please try again later.',
      'CART_CREATION_FAILED',
      HttpStatus.BAD_REQUEST,
    );
  }
}
