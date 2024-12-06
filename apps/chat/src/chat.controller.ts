import {
  Controller,
  Get,
  UseFilters,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { CreateRoomDto } from '@app/common';

import { ChatService } from './chat.service';
import { RoomsService } from './rooms/rooms.service';

@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly roomsService: RoomsService,
  ) {}

  @Get()
  getHello() {
    return this.roomsService.createRoom('test', [
      'b6891d6c-1691-4ef7-94ae-3bde2d279cec',
      '1dfe6d79-def3-4cfc-b20f-571e690b2a01',
    ]);
  }

  @MessagePattern({ cmd: 'room.create' })
  async createRoom(@Payload() data: CreateRoomDto) {
    return this.roomsService.createRoom(data.name, data.userIds);
  }

  @MessagePattern({ cmd: 'room.get.all' })
  async getRooms(@Payload() { userId }: { userId: string }) {
    return this.roomsService.getRooms(userId);
  }
}
