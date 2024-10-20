import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
