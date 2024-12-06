import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class WsRpcErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        return throwError(() => new WsException(error.response || error));
      }),
    );
  }
}
