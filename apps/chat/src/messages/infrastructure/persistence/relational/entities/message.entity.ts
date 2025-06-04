import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  ManyToOne,
  OneToOne,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { RoomEntity, UserEntity } from '@app/common/entities';

import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';

@Entity({
  name: 'message',
})
export class MessageEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @ManyToOne(() => RoomEntity, (room) => room.id, { onDelete: 'CASCADE' })
  room: RoomEntity;

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable()
  undeliveredUsers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable()
  unreadUsers: UserEntity[];

  @ApiProperty()
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  sender: UserEntity;

  @ApiProperty()
  @Column({ nullable: true })
  imageUrl: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
