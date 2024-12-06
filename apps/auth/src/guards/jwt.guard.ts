import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

export default class JwtAuthGuard
  extends AuthGuard('jwt')
  implements CanActivate
{
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const result = (await super.canActivate(context)) as boolean;
      return result;
    } catch (error) {
      throw new RpcException(new UnauthorizedException());
    }
  }
}
