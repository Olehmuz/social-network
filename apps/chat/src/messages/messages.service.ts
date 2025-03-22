import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

import { User } from '@app/common';

import { RoomsService } from '../rooms/rooms.service';
import { MessageRepository } from './infrastructure/persistence/message.repository';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly roomsService: RoomsService,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  async sendMessageToRoom(roomId: string, senderId: string, message: string) {
    const room = await this.roomsService.findRoomById(roomId);

    const sender = room.users.find((u) => u.id === senderId);

    if (!sender) {
      throw new RpcException(
        new BadRequestException('Sender not found in room'),
      );
    }

    const users = room.users;

    return this.messageRepository.create({
      message,
      sender,
      room,
      undeliveredUsers: users,
      unreadUsers: users.filter((u) => u.id !== senderId),
    });
  }

  async getMessagesByRoomId(roomId: string) {
    const room = await this.roomsService.findRoomById(roomId);

    if (!room) {
      throw new RpcException(new BadRequestException('Room not found'));
    }

    return this.messageRepository.findByRoomId(roomId);
  }

  async getMessages(userId: string) {
    return this.messageRepository.findAllByUserId(userId);
  }
}
