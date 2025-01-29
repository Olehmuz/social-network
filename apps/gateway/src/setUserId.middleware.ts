import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class SetUserIdMiddleware implements NestMiddleware {
  async use(socket: any, handleConnection, next: (err?: any) => void) {
    // Викликає handleConnection та чекає завершення
    const userId = await handleConnection(socket);
    if (userId) {
      socket.userId = userId;
    }
    next();
  }
}
