import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { ApiBearerAuth } from '@nestjs/swagger';
import { MessageBody, WebSocketServer } from '@nestjs/websockets';
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
  @Post('/rooms/:roomId/messages')
  async sendMessage(
    @CurrentUser() user: User,
    @Body() dto: SendMessageDto,
    @Param('roomId') roomId: string,
  ) {
    const message = await firstValueFrom<any>(
      this.chatService.send(
        { cmd: 'message.send' },
        { message: dto.message, senderId: user.id, roomId },
      ),
    );

    return message;
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

  @Post('/room')
  async createRoom(@MessageBody() dto: CreateRoomDto): Promise<Room> {
    const room = await firstValueFrom<Room>(
      this.chatService.send({ cmd: 'room.create' }, dto),
    );

    this.handleRoomsUpdate(
      room.users.map((user) => user.id),
      room,
    );

    return room;
  }

  async handleRoomsUpdate(userIds: string[], room: Room) {
    console.log('HANDLE ROOMS UPDATE', userIds);
    userIds.map(async (userId) => {
      const usersSockets = await this.gatewayService.getUsersSockets([userId]);
      console.log('USERS SOCKETS', usersSockets);

      this.gateway.server.to(usersSockets).emit('room-created', room);
    });
  }
}
