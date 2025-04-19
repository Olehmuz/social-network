import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

import { RoomType, User } from '@app/common';

import { RoomRepository } from './infrastructure/persistence/room.repository';

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomsRepository: RoomRepository,
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
  ) {}

  async createRoom(
    name: string,
    userIds: string[],
    type: RoomType,
    ownerId: string,
  ) {
    const users = await firstValueFrom(
      this.authClient.send<User[]>({ cmd: 'user.find.by.ids' }, userIds),
    );

    if (!users || users.length !== userIds.length) {
      throw new RpcException(new BadRequestException('Some users not found'));
    }

    return this.roomsRepository.create({
      name,
      users,
      type,
      owner: users.find((user) => user.id === ownerId),
    });
  }

  async deleteRoom(roomId: string) {
    const room = await this.roomsRepository.findById(roomId);

    await this.roomsRepository.remove(roomId);

    return room;
  }

  async getRooms(userId: string) {
    return this.roomsRepository.findAllByUserId(userId);
  }

  async findRoomById(roomId: string) {
    return this.roomsRepository.findById(roomId);
  }

  async addUsersToRoom(roomId: string, userIds: string[]) {
    const room = await this.roomsRepository.findById(roomId);

    if (!room) {
      throw new RpcException(new BadRequestException('Room not found'));
    }

    const users = await firstValueFrom(
      this.authClient.send<User[]>({ cmd: 'user.find.by.ids' }, userIds),
    );

    if (!users || users.length !== userIds.length) {
      throw new RpcException(new BadRequestException('Some users not found'));
    }

    await this.roomsRepository.update(roomId, {
      users: [...room.users, ...users],
    });

    return [...room.users, ...users];
  }

  async removeUsersFromRoom(roomId: string, userIds: string[]) {
    const room = await this.roomsRepository.findById(roomId);

    if (!room) {
      throw new RpcException(new BadRequestException('Room not found'));
    }

    if (room.owner.id === userIds[0]) {
      throw new RpcException(
        new BadRequestException('Owner cannot be removed'),
      );
    }

    if (!userIds) {
      throw new RpcException(new BadRequestException('User IDs is required'));
    }

    return this.roomsRepository.update(roomId, {
      users: room.users.filter((user) => !userIds.includes(user.id)),
    });
  }
}
