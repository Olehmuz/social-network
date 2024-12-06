import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ default: 'someuser@gmai.com' })
  @IsEmail()
  @IsString()
  email: string;

  @ApiProperty({ default: '12345678' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ default: 'alegmuz' })
  @IsString()
  nickname: string;
}
