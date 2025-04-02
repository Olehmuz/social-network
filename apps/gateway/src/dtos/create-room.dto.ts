import { IsArray, IsString } from 'class-validator';

import { RoomType } from '@app/common';

export class CreateRoomDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  userIds: string[];

  @IsString()
  type: RoomType;
}

export class CreateRoomDtoWithOwnerId extends CreateRoomDto {
  @IsString()
  ownerId: string;
}
