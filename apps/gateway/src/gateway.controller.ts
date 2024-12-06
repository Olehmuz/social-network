import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { CurrentUser } from '@app/common/auth/current-user.decorator';
import { JwtAuthGuard } from '@app/common/auth/jwt.guard';
import { CacheService } from '@app/common/cache/infrastructure/cache.service';
import { AUTH_SERVICE } from '@app/common/constatnts/services.constants';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { SignInDto, SignUpDto, User } from '@app/common';

@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class GatewayController {
  constructor(
    @Inject(AUTH_SERVICE) private authClient: ClientProxy,
    private readonly cacheService: CacheService,
  ) {}

  @Post('/signUp')
  signUp(@Body() dto: SignUpDto) {
    return this.authClient.send({ cmd: 'user.sign.up' }, dto);
  }

  @Post('/signIn')
  signIn(@Body() dto: SignInDto) {
    return this.authClient.send({ cmd: 'user.sign.in' }, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/hello')
  async sendAck(@CurrentUser() user: User) {
    console.log('gateway', user);
    return user;
  }

  @Get('/test')
  async test() {
    await this.cacheService.set('test', 'test123');
    return 'test';
  }

  @Get('/test-get')
  async testGet() {
    return this.cacheService.get('test');
  }
}
