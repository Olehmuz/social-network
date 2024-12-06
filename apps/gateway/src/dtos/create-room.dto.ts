import { IsArray, IsString } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
