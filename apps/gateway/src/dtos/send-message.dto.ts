import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  roomId: string;
}

export class SendMessageWithSenderDto extends SendMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;
}
