import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';

type HttpWsException = WsException & {
  response: {
    message: string;
  };
};

@Catch()
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: HttpWsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    console.log('exception', exception);
    client.emit('error', {
      message: exception?.response || exception?.message || 'An error occurred',
    });
  }
}
