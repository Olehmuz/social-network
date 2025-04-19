import { IsString, IsArray } from 'class-validator';

export class AddRoomUserDto {
  @IsArray()
  @IsString({ each: true })
  userIds: string[];
}
