import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { GATEWAY_SERVICE } from '@app/common/constatnts/services.constants';
import { RmqService } from '@app/common/modules/rmq/rmq.service';

import { RpcExceptionFilter } from '@app/utils/exceptions/rpc-exception.filter';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Auth API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new RpcExceptionFilter());

  app.enableCors();

  const rmqService = app.get<RmqService>(RmqService);

  app.connectMicroservice<RmqOptions>(
    rmqService.getOptions(GATEWAY_SERVICE, true),
  );

  await app.startAllMicroservices();

  await app.listen(3001);
}
bootstrap();
