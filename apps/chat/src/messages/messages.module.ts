import { Module } from '@nestjs/common';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';
import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { MessagesService } from './messages.service';
import { RoomsModule } from '../rooms/rooms.module';
import { RelationalMessagePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    RelationalMessagePersistenceModule,
    RoomsModule,
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [MessagesService],
  exports: [MessagesService],
})
export class MessagesModule {}
