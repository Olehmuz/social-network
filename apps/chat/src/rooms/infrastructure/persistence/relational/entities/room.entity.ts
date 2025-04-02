import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { UserEntity } from '@app/common/entities';

import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';

export enum RoomType {
  GROUP = 'group',
  CHANNEL = 'channel',
}

@Entity({
  name: 'room',
})
export class RoomEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ nullable: true })
  name?: string;

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.rooms)
  users: UserEntity[];

  @ApiProperty()
  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ enum: RoomType })
  @Column({
    type: 'enum',
    enum: RoomType,
    default: RoomType.GROUP,
  })
  type: RoomType;
}
