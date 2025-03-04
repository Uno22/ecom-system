import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiException extends HttpException {
  constructor(
    message: string,
    errorCode: string,
    statusCode: number = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        success: false,
        message,
        statusCode,
        data: null,
        error: {
          code: errorCode,
          details: message,
        },
      },
      statusCode,
    );
  }
}
