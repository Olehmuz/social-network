import { Module } from '@nestjs/common';

import { AUTH_SERVICE } from '../constatnts/services.constants';
import { RmqModule } from '../modules/rmq/rmq.module';

@Module({
  imports: [RmqModule.register({ name: AUTH_SERVICE })],
  exports: [RmqModule],
})
export class AuthModule {}
