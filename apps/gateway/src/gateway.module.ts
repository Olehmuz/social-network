import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';
import { RmqModule } from '@app/common/modules/rmq/rmq.module';

import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';

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
  ],

  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
