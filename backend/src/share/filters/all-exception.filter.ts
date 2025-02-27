import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiException } from '../exceptions';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody = exception.getResponse();
    console.error('[ERROR] ********** exception responseBody:', responseBody);

    const responseBodyAsAny = responseBody as any;
    if (Array.isArray(responseBodyAsAny.message)) {
      responseBody = {
        success: false,
        message: responseBodyAsAny.error || 'Internal Server Error',
        statusCode: status,
        data: null,
        error: {
          code: HttpStatus[status] || 'UNKNOWN_ERROR',
          details: responseBodyAsAny.message.join(', '),
        },
      };
    } else if (!(exception instanceof ApiException)) {
      responseBody = {
        success: false,
        message: 'Internal Server Error',
        statusCode: status,
        data: null,
        error: {
          code: HttpStatus[status] || 'UNKNOWN_ERROR',
          details: exception.message || 'An unexpected error occurred',
        },
      };
    }

    response.status(status).json(responseBody);
  }
}
