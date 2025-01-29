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
  message: string;

  @ApiProperty()
  @ManyToOne(() => RoomEntity, (room) => room.id)
  room: RoomEntity;

  // @ApiProperty({ default: [] })
  // @ManyToOne(() => UserEntity, (user) => user.id)
  // undeliveredUsers: UserEntity[];

  // @ApiProperty({ default: [] })
  // @ManyToOne(() => UserEntity, (user) => user.id)
  // unreadUsers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable() // Необхідно для ManyToMany зв'язків
  undeliveredUsers: UserEntity[];

  @ManyToMany(() => UserEntity, (user) => user.id)
  @JoinTable() // Необхідно для ManyToMany зв'язків
  unreadUsers: UserEntity[];

  @ApiProperty()
  @OneToOne(() => UserEntity, (user) => user.id)
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
