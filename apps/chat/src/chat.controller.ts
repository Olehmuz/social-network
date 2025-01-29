import {
  Controller,
  Get,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import {
  CreateRoomDto,
  SendMessageDto,
  SendMessageWithSenderDto,
} from '@app/common';

import { ChatService } from './chat.service';
import { MessagesService } from './messages/messages.service';
import { RoomsService } from './rooms/rooms.service';

@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly roomsService: RoomsService,
    private readonly messagesService: MessagesService,
  ) {}

  @Get()
  getHello() {
    return this.messagesService.sendMessageToRoom(
      '91203c4f-81b7-4227-9c5d-c11dd24b2767',
      'b6891d6c-1691-4ef7-94ae-3bde2d279cec',
      'Hello, world!',
    );
  }

  @MessagePattern({ cmd: 'room.create' })
  async createRoom(@Payload() data: CreateRoomDto) {
    return this.roomsService.createRoom(data.name, data.userIds);
  }

  @MessagePattern({ cmd: 'room.get.all' })
  async getRooms(@Payload() { userId }: { userId: string }) {
    return this.roomsService.getRooms(userId);
  }

  @MessagePattern({ cmd: 'message.send' })
  async createMessage(@Payload() data: SendMessageWithSenderDto) {
    console.log('SEND MESSAGE', data);
    return this.messagesService.sendMessageToRoom(
      data.roomId,
      data.senderId,
      data.message,
    );
  }
}
