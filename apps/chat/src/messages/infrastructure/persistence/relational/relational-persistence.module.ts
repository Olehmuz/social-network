import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MessageEntity, RoomEntity, UserEntity } from '@app/common/entities';

import { MessageRepository } from '../message.repository';
import { MessageRelationalRepository } from './repositories/message.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity, RoomEntity])],
  providers: [
    {
      provide: MessageRepository,
      useClass: MessageRelationalRepository,
    },
  ],
  exports: [MessageRepository],
})
export class RelationalMessagePersistenceModule {}
