import { Controller, Get, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

@Controller()
export class GatewayController {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  @Get('/hello')
  async sendAck() {
    const res = await firstValueFrom(
      this.authClient.send({ cmd: 'test_ack' }, { data: 'data' }),
    );
    console.log(res);
    console.log('event');
    return 'event';
  }
}
