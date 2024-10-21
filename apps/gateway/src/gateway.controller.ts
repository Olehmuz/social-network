import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { SignInDto, SignUpDto } from '@app/common';

@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class GatewayController {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  @Post('/signUp')
  signUp(@Body() dto: SignUpDto) {
    return this.authClient.send({ cmd: 'user.sign.up' }, dto);
  }

  @Post('/signIn')
  signIn(@Body() dto: SignInDto) {
    return this.authClient.send({ cmd: 'user.sign.in' }, dto);
  }

  @Get('/hello')
  async sendAck() {
    throw new UnauthorizedException('Unauthorized');
  }
}
