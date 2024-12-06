import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AuthModule } from '@app/common/auth/auth.module';
import { CacheModule } from '@app/common/cache/cache.module';
import {
  AUTH_SERVICE,
  CHAT_SERVICE,
} from '@app/common/constatnts/services.constants';
import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ChatGateway } from './ws.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`./.env`],
      validationSchema: Joi.object({
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
    }),
    RmqModule.register({
      name: AUTH_SERVICE,
    }),
    RmqModule.register({
      name: CHAT_SERVICE,
    }),
    AuthModule,
    CacheModule,
  ],

  controllers: [GatewayController],
  providers: [GatewayService, ChatGateway],
})
export class GatewayModule {}
