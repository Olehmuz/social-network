import { Module } from '@nestjs/common';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';
import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RoomsService } from './rooms.service';

@Module({
  imports: [
    RelationalUserPersistenceModule,
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
  ],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
