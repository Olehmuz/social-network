import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

import { User } from '@app/common';

import { RoomRepository } from './infrastructure/persistence/room.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomRepository,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  async createRoom(name: string, userIds: string[]) {
    const users = await firstValueFrom(
      this.authClient.send<User[]>({ cmd: 'user.find.by.ids' }, userIds),
    );

    if (!users || users.length !== userIds.length) {
      throw new RpcException(new BadRequestException('Some users not found'));
    }

    return this.roomsRepository.create({ name, users });
  }

  async getRooms(userId: string) {
    return this.roomsRepository.findAllByUserId(userId);
  }
}
