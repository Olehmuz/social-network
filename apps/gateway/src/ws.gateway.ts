import { Inject, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ClientProxy,
  EventPattern,
  MessagePattern,
} from '@nestjs/microservices';
import {
  ConnectedSocket,
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
import { SendMessageDto } from './dtos/send-message.dto';
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

  @SubscribeMessage('get-rooms')
  async getRooms(socket: Socket) {
    const user = socket.data.user;

    const rooms = await firstValueFrom<Room[]>(
      this.chatService.send({ cmd: 'room.get.all' }, { userId: user.id }),
    );

    return { event: 'get-rooms', data: rooms };
  }

  // @EventPattern('room.created')
  // async handleRoomCreated(room: Room) {
  //   console.log('room.created', room);
  // this.handleRoomsUpdate(
  //   room.users.map((user) => user.id),
  //   room,
  // );
  // }
  @EventPattern('test')
  async handleRoomCreated(room: Room) {
    console.log('test', room);
  }

  @MessagePattern({ cmd: 'room.created' })
  async handledsa() {
    console.log('HANDLED');
  }

  async handleRoomsUpdate(userIds: string[], room: Room) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);
      console.log(usersSockets);
      this.server.to(usersSockets).emit('room-created', room);
    });
  }

  @SubscribeMessage('get-messages')
  async getMessages(socket: Socket, @MessageBody() roomId: string) {
    const messages = await firstValueFrom<any[]>(
      this.chatService.send({ cmd: 'message.get.all' }, { roomId }),
    );

    return { event: 'get-messages', data: messages };
  }

  async handleDisconnect(socket: Socket) {
    // console.log('HANDLE DISCONNECT');
  }

  async handleConnection(socket: Socket) {
    const token =
      (socket.handshake.auth.token || socket.handshake.headers.auth) ?? null;
    // console.log(socket.handshake);
    if (!token) {
      this.handleDisconnect(socket);
      return;
    }

    await this.gatewayService.handleConnection(socket, token);
  }
}
