import { Controller, UseFilters } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { SignInDto, SignUpDto } from '@app/common';

import { AuthService } from './auth.service';

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

  @MessagePattern({ cmd: 'user.validate' })
  validateUser() {}

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
