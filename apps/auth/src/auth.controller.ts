import {
  Controller,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { CurrentUser } from '@app/common/auth';

import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { SignInDto, SignUpDto, User } from '@app/common';

import { AuthService } from './auth.service';
import JwtAuthGuard from './guards/jwt.guard';

@UseInterceptors(RpcErrorInterceptor)
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'user.sign.up' })
  signUp(@Payload() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @MessagePattern({ cmd: 'user.sign.in' })
  signIn(@Payload() dto: SignInDto) {
    return this.authService.signIn(dto);
  }

  @UseGuards(JwtAuthGuard)
  @MessagePattern({ cmd: 'user.validate' })
  validateUser(@CurrentUser() user: User) {
    return user;
  }

  @EventPattern('test_ack')
  sayHello(data: any) {
    console.log('hello');
    return 'hello';
  }

  @MessagePattern({ cmd: 'test_ack' })
  getHello(@Payload() data: any, @Ctx() context: RmqContext) {
    console.log('hello');
    return 'hello';
  }
}
