import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { ApiResponseDto } from '../dto';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<any> {
    console.log('ResponseInterceptor');
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const mapppedMethodAndMessages = {
      GET: 'Success',
      POST: 'Resource created successfully',
      PUT: 'Resource updated successfully',
      PATCH: 'Resource updated successfully',
      DELETE: 'Resource deleted successfully',
    };
    return next
      .handle()
      .pipe(
        map(
          (data) =>
            new ApiResponseDto(true, data, mapppedMethodAndMessages[method]),
        ),
      );
  }
}
