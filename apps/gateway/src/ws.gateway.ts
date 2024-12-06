import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

import {
  AUTH_SERVICE,
  CHAT_SERVICE,
} from '@app/common/constatnts/services.constants';

import { WebSocketExceptionFilter } from '@app/utils/ws-exception.filter';

import { Room } from '@app/common';

import { CreateRoomDto } from './dtos/create-room.dto';
import { GatewayService } from './gateway.service';

@UseFilters(new WebSocketExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: ClientProxy,
    @Inject(CHAT_SERVICE) private readonly chatService: ClientProxy,
    private readonly gatewayService: GatewayService,
  ) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('create-room')
  async createRoom(@MessageBody() dto: CreateRoomDto): Promise<any> {
    const room = await firstValueFrom<Room>(
      this.chatService.send({ cmd: 'room.create' }, dto),
    );

    this.handleRoomsUpdate(room.users.map((user) => user.id));
  }

  @SubscribeMessage('get-rooms')
  async getRooms(socket: Socket) {
    const user = socket.data.user;

    const rooms = await firstValueFrom<Room[]>(
      this.chatService.send({ cmd: 'room.get.all' }, { userId: user.id }),
    );

    return { event: 'get-rooms', data: rooms };
  }

  async handleRoomsUpdate(userIds: string[]) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);

      const rooms = await firstValueFrom<Room[]>(
        this.chatService.send({ cmd: 'room.get.all' }, { userId }),
      );

      this.server.to(usersSockets).emit('get-rooms', rooms);
    });
  }

  async handleDisconnect(socket: Socket) {
    console.log('HANDLE DISCONNECT');
  }

  async handleConnection(socket: Socket) {
    const token = socket.handshake.headers.authorization ?? null;

    if (!token) {
      this.handleDisconnect(socket);
      return;
    }

    this.gatewayService.handleConnection(socket, token);
  }
}
