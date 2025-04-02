import { User } from './user.model';

export enum RoomType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

export interface Room {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type: RoomType;
  users: User[];
  image?: string;
  owner: {
    id: string;
  };
}