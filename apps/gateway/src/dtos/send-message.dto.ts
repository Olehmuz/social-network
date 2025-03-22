import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @ApiProperty({ default: 'Message text' })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export class SendMessageWithSenderDto extends SendMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}
