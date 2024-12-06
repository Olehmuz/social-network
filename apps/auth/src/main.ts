import { Logger, NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  MicroserviceOptions,
  RmqOptions,
  Transport,
} from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';
import { RmqService } from '@app/common/modules/rmq/rmq.service';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { AuthModule } from './auth.module';

// import * as fs from 'fs';

async function bootstrap() {
  const appOptions: NestApplicationOptions = {};

  // appOptions.httpsOptions = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./cert.pem'),
  // };

  const app = await NestFactory.create(AuthModule, appOptions);

  const configService = app.get(ConfigService);

  const port = configService.get('APP_PORT');
  const env = process.env.NODE_ENV || 'dev';

  const logger = new Logger();

  logger.log(`Environment: ${env}`);
  logger.log(`Server running on http://localhost:${port}`);

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(AUTH_SERVICE, true),
  );

  // app.useGlobalInterceptors(new RpcErrorInterceptor());

  await app.startAllMicroservices();

  await app.listen(port);
}
bootstrap();
