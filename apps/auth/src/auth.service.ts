import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RpcException } from '@nestjs/microservices';
import { compare, hash } from 'bcrypt';

import { SignUpDto, SignInDto } from '@app/common/dtos';

import { User } from '@app/common';

import { Tokens } from './intefaces/tokens.interface';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(dto: SignInDto): Promise<Tokens> {
    const { email, password } = dto;
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new RpcException(
        new UnauthorizedException('User with such email does not exist.'),
      );
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new RpcException(new UnauthorizedException('Incorrect password.'));
    }

    const { access_token } = await this.generateTokens(user);

    return {
      access_token,
    };
  }

  async signUp(dto: SignUpDto): Promise<Tokens> {
    const { email, password, nickname } = dto;

    const existedUser = await this.usersService.findUserByEmail(email);

    if (existedUser) {
      throw new RpcException(
        new BadRequestException('User with such email already exists.'),
      );
    }

    const hashedPassword = await hash(password, +process.env.SALT!);

    const user = await this.usersService.create({
      nickname,
      email,
      password: hashedPassword,
    });

    return this.generateTokens(user);
  }

  private async generateTokens(payload: User): Promise<Tokens> {
    const tokenPayload = {
      sub: payload.id,
      email: payload.email,
    };

    const accessPromise = this.jwtService.signAsync(tokenPayload, {
      expiresIn: process.env.JWT_EXPIRES_IN,
      secret: process.env.JWT_AT_SECRET,
    });

    const [access_token] = await Promise.all([accessPromise]);

    return {
      access_token,
    };
  }
}
