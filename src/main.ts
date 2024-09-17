import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const port = configService.get('PORT');
  const env = process.env.NODE_ENV || 'dev';

  const logger = new Logger();

  logger.log(`Environment: ${env}`);
  logger.log(`Server running on http://localhost:${port}`);

  const config = new DocumentBuilder()
    .setTitle('Posts API')
    .setDescription('API для створення та перегляду постів')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port || 3000);
}
bootstrap();
