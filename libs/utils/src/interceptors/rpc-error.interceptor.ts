import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class RpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log(error);

        return throwError(
          () =>
            new RpcException(
              error.response ||
                new InternalServerErrorException(error.toString()),
            ),
        );
      }),
    );
  }
}
