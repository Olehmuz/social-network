import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WsException } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';

import { CacheService } from '@app/common/cache/infrastructure/cache.service';
import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

@Injectable()
export class GatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    private readonly cache: CacheService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async handleConnection(socket: Socket, token: string) {
    console.log('HANDLE CONNECTION');

    try {
      const user = await firstValueFrom(
        this.authService.send(
          { cmd: 'user.validate' },
          { Authentication: token },
        ),
      );

      if (!user) {
        socket.emit('error', 'Unauthorized');
        socket.disconnect();
        return;
      }

      socket.data.user = user;
      this.saveUserSocket(user.id, socket.id);

      console.log('User connected', user);
    } catch (error) {
      socket.emit('error', error?.response ?? 'Unauthorized');
      socket.disconnect();
    }
  }

  async saveUserSocket(userId: string, socketId: string) {
    if (!userId || !socketId) return;

    await this.cache.set(`user-${userId}`, socketId);
  }

  async getUsersSockets(userIds: string[]) {
    return Promise.all(
      userIds.map(async (id) => {
        return await this.cache.get(`user-${id}`);
      }),
    );
  }
}
