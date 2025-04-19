import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { WebSocketServer } from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server } from 'socket.io';

import { CurrentUser } from '@app/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@app/common/auth/jwt.guard';
import { CacheService } from '@app/common/cache/infrastructure/cache.service';
import {
  AUTH_SERVICE,
  CHAT_SERVICE,
  GATEWAY_SERVICE,
} from '@app/common/constatnts/services.constants';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import {
  CreateRoomDto,
  Room,
  SendMessageDto,
  SignInDto,
  SignUpDto,
  User,
} from '@app/common';

import { AddRoomUserDto } from './dtos/add-room-user.dto';
import { GatewayService } from './gateway.service';
import { ChatGateway } from './ws.gateway';
@ApiBearerAuth()
@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class GatewayController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    @Inject(CHAT_SERVICE) private readonly chatService: ClientProxy,
    @Inject(GATEWAY_SERVICE) private readonly gatewayClient: ClientProxy,
    private readonly cacheService: CacheService,
    private readonly gatewayService: GatewayService,
    private readonly gateway: ChatGateway,
  ) {}

  @WebSocketServer()
  server: Server;

  @Post('/signUp')
  signUp(@Body() dto: SignUpDto) {
    return this.authClient.send({ cmd: 'user.sign.up' }, dto);
  }

  @Post('/signIn')
  signIn(@Body() dto: SignInDto) {
    return this.authClient.send({ cmd: 'user.sign.in' }, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/hello')
  async sendAck(@CurrentUser() user: User) {
    console.log('gateway', user);
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rooms')
  async getRooms(@CurrentUser() user: User) {
    const rooms = await firstValueFrom<Room[]>(
      this.chatService.send({ cmd: 'room.get.all' }, { userId: user.id }),
    );

    return rooms;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rooms/:roomId')
  async getRoom(@CurrentUser() user: User, @Param('roomId') roomId: string) {
    const room = await firstValueFrom<Room>(
      this.chatService.send({ cmd: 'room.get.by.id' }, { roomId }),
    );

    return room;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/room')
  async createRoom(
    @Body() dto: CreateRoomDto,
    @CurrentUser() user: User,
  ): Promise<Room> {
    console.log('dto', { ...dto, ownerId: user.id });

    const room = await firstValueFrom<Room>(
      this.chatService.send(
        { cmd: 'room.create' },
        { ...dto, ownerId: user.id },
      ),
    );

    this.handleRoomsCreate(
      room.users.map((user) => user.id),
      room,
    );

    return room;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/rooms/:roomId/messages')
  async sendMessage(
    @CurrentUser() user: User,
    @Body() dto: SendMessageDto,
    @Param('roomId') roomId: string,
  ) {
    this.chatService.emit('message.send', {
      message: dto.message,
      senderId: user.id,
      roomId,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/rooms/:roomId/messages')
  async getMessagesByRoomId(
    @CurrentUser() user: User,
    @Param('roomId') roomId: string,
  ) {
    const messages = await firstValueFrom<any>(
      this.chatService.send({ cmd: 'message.get.all.by.room.id' }, { roomId }),
    );

    return messages;
  }

  @UseGuards(JwtAuthGuard)
  @Post('/rooms/:roomId/users')
  async addUsersToRoom(
    @CurrentUser() user: User,
    @Param('roomId') roomId: string,
    @Body() dto: AddRoomUserDto,
  ) {
    const addedUsers = await firstValueFrom<User[]>(
      this.chatService.send(
        { cmd: 'room.add.users' },
        { roomId, userIds: dto.userIds },
      ),
    );

    const room = await firstValueFrom<Room>(
      this.chatService.send({ cmd: 'room.get.by.id' }, { roomId }),
    );
    console.log('room', addedUsers);
    this.handleRoomsCreate(
      addedUsers.map((user) => user.id),
      room,
    );

    this.handleRoomsUpdate(
      room.users.map((user) => user.id),
      room,
    );

    return addedUsers;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/rooms/:roomId')
  async deleteRoom(@CurrentUser() user: User, @Param('roomId') roomId: string) {
    const room = await firstValueFrom<Room>(
      this.chatService.send({ cmd: 'room.delete' }, { roomId }),
    );

    console.log('room', room);

    this.handleRoomLeave(
      room.users.map((user) => user.id),
      room,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('/rooms/:roomId/leave')
  async leaveRoom(@CurrentUser() user: User, @Param('roomId') roomId: string) {
    const room = await firstValueFrom<Room>(
      this.chatService.send(
        { cmd: 'room.remove.users' },
        { roomId, userIds: [user.id] },
      ),
    );

    this.handleRoomLeave([user.id], room);
    this.handleRoomsUpdate(
      room.users.map((user) => user.id),
      room,
    );
  }

  @Get('/users')
  async getUsers() {
    const users = await firstValueFrom<User[]>(
      this.authClient.send({ cmd: 'user.get.all' }, {}),
    );

    return users;
  }

  @Get('/test')
  async test() {
    await this.cacheService.set('test', 'test123');
    return 'test';
  }

  @Get('/test-get')
  async testGet() {
    this.gatewayClient.emit('test', 'test');
    return this.cacheService.get('test');
  }

  async handleRoomsCreate(userIds: string[], room: Room) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);

      this.gateway.server.to(usersSockets).emit('room-created', room);
    });
  }

  async handleRoomsUpdate(userIds: string[], room: Room) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);
      this.gateway.server.to(usersSockets).emit('room-updated', room);
    });
  }

  async handleRoomLeave(userIds: string[], room: Room) {
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);
      this.gateway.server.to(usersSockets).emit('room-deleted', room);
    });
  }

  @EventPattern('message.publish')
  async handleRoomsMessageUpdate(data: { roomId: string; message: string }) {
    this.gateway.server
      .to(`room-${data.roomId}`)
      .emit('message-retrieved', data.message);
  }
}
