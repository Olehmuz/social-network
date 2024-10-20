import { NestFactory } from '@nestjs/core';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  // console.log(process.env);
  await app.listen(3000);
}
bootstrap();
