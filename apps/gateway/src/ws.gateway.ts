import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

import { CHAT_SERVICE } from '@app/common/constatnts/services.constants';

import { WebSocketExceptionFilter } from '@app/utils/ws-exception.filter';

import { Room } from '@app/common';

import { GatewayService } from './gateway.service';

@UseFilters(new WebSocketExceptionFilter())
@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatService: ClientProxy,
    private readonly gatewayService: GatewayService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleRoomsUpdate(userIds: string[], room: Room) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);
      console.log(usersSockets);
      this.server.to(usersSockets).emit('room-created', room);
    });
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(socket: Socket, payload: { roomId: string }) {
    socket.join(`room-${payload.roomId}`);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(socket: Socket, payload: { roomId: string }) {
    socket.leave(`room-${payload.roomId}`);
  }

  @SubscribeMessage('get-messages')
  async getMessages(socket: Socket, @MessageBody() roomId: string) {
    const messages = await firstValueFrom<any[]>(
      this.chatService.send({ cmd: 'message.get.all' }, { roomId }),
    );

    return { event: 'get-messages', data: messages };
  }

  async handleConnection(socket: Socket) {
    const token =
      (socket.handshake.auth.token || socket.handshake.headers.auth) ?? null;

    if (!token) {
      return;
    }

    await this.gatewayService.handleConnection(socket, token);
  }
}
