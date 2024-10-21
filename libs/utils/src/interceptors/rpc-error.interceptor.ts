import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError((error) =>
          throwError(() => new RpcException(error.response)),
        ),
      );
  }
}

// @Injectable()
// export class RpcErrorInterceptor implements NestInterceptor {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
//     return next.handle().pipe(
//       catchError((error) => {
//         throw new HttpException(
//           error?.response?.message || 'Internal server error',
//           error?.response?.statusCode || 500,
//         );
//       }),
//     );
//   }
// }
