import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { MessageEntity, RoomEntity, UserEntity } from '@app/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: false,
      envFilePath: [`./apps/chat/.env`, `./.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [RoomEntity, UserEntity, MessageEntity],
        synchronize: true,
      }),
    }),
    RoomsModule,
    RmqModule,
    MessagesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
