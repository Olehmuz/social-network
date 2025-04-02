import {
  Controller,
  Get,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import {
  CreateRoomDtoWithOwnerId,
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

  @MessagePattern({ cmd: 'room.create' })
  async createRoom(@Payload() data: CreateRoomDtoWithOwnerId) {
    return this.roomsService.createRoom(
      data.name,
      data.userIds,
      data.type,
      data.ownerId,
    );
  }

  @MessagePattern({ cmd: 'room.get.all' })
  async getRooms(@Payload() { userId }: { userId: string }) {
    return this.roomsService.getRooms(userId);
  }

  @MessagePattern({ cmd: 'room.get.by.id' })
  async getRoomById(@Payload() { roomId }: { roomId: string }) {
    return this.roomsService.findRoomById(roomId);
  }

  @MessagePattern({ cmd: 'message.get.all.by.room.id' })
  async getMessageById(@Payload() { roomId }: { roomId: string }) {
    return this.messagesService.getMessagesByRoomId(roomId);
  }

  @EventPattern('message.send')
  async createMessage(data: SendMessageWithSenderDto) {
    return this.messagesService.sendMessageToRoom(
      data.roomId,
      data.senderId,
      data.message,
    );
  }
}
