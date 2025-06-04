import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Socket } from 'socket.io';

import { CacheService } from '@app/common/cache/infrastructure/cache.service';
import {
  AUTH_SERVICE,
  CHAT_SERVICE,
} from '@app/common/constatnts/services.constants';

@Injectable()
export class GatewayService {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(CHAT_SERVICE) private readonly chatService: ClientProxy,
    private readonly cache: CacheService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async handleConnection(socket: Socket, token: string) {
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
      this.joinUserRooms(socket, user.id);
    } catch (error) {
      socket.emit('error', error?.response ?? 'Unauthorized');
      socket.disconnect();
    }
  }

  async joinUserRooms(socket: Socket, userId: string) {
    const rooms = await firstValueFrom(
      this.chatService.send({ cmd: 'room.get.all' }, { userId }),
    ).catch((error) => {
      console.log('Error getting rooms', error);
    });

    rooms.forEach((room) => {
      socket.join(room.id);
    });
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
