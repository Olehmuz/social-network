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

  // async createMessage(name: string, userIds: string[]) {
  //   const users = await firstValueFrom(
  //     this.authClient.send<User[]>({ cmd: 'user.find.by.ids' }, userIds),
  //   );

  //   if (!users || users.length !== userIds.length) {
  //     throw new RpcException(new BadRequestException('Some users not found'));
  //   }

  //   return this.messageRepository.create({ name, users });
  // }

  async sendMessageToRoom(roomId: string, senderId: string, message: string) {
    const room = await this.roomsService.findRoomById(roomId);

    const sender = room.users.find((u) => u.id === senderId);

    const users = room.users;

    return this.messageRepository.create({
      message,
      sender,
      room,
      undeliveredUsers: users,
      unreadUsers: users.filter((u) => u.id !== senderId),
    });
  }

  async getMessages(userId: string) {
    return this.messageRepository.findAllByUserId(userId);
  }
}
