import { HttpStatus } from '@nestjs/common';
import { ApiException } from './api.exception';

export class ProductInsufficientQuantityException extends ApiException {
  constructor() {
    super(
      'Product is not available in sufficient quantity',
      'PRODUCT_INSUFFICIENT_QUANTITY',
      HttpStatus.NOT_FOUND,
    );
  }
}
