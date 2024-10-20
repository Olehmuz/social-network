import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomEntity, UserEntity } from '@app/common/entities';

import { RoomRepository } from '../room.repository';
import { RoomRelationalRepository } from './repositories/room.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoomEntity, UserEntity])],
  providers: [
    {
      provide: RoomRepository,
      useClass: RoomRelationalRepository,
    },
  ],
  exports: [RoomRepository],
})
export class RelationalUserPersistenceModule {}
