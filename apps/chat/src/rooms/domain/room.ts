import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../../../auth/src/users/domain/user';

export class Room {
  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  users: User[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
