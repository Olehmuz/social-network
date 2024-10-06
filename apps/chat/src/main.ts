import { Logger, NestApplicationOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { ChatModule } from './chat.module';

// import * as fs from 'fs';

async function bootstrap() {
  const appOptions: NestApplicationOptions = {};

  // appOptions.httpsOptions = {
  //   key: fs.readFileSync('./key.pem'),
  //   cert: fs.readFileSync('./cert.pem'),
  // };

  const app = await NestFactory.create(ChatModule, appOptions);

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

  await app.listen(port || 3000);
}
bootstrap();
