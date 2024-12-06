import { Module } from '@nestjs/common';

import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { RelationalUserPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [RelationalUserPersistenceModule, RmqModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
