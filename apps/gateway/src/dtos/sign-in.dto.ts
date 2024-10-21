import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ default: 'someuser@gmai.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ default: '12345678' })
  @IsString()
  @MinLength(8)
  password: string;
}
