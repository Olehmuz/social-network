import { ApiProperty } from '@nestjs/swagger';

import { Room, User } from '@app/common';

export class Message {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  room: Room;

  sender: User;

  @ApiProperty()
  undeliveredUsers: User[];

  @ApiProperty()
  unreadUsers: User[];

  @ApiProperty()
  imageUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
