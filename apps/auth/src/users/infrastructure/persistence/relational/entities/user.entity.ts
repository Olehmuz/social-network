import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { RoomEntity } from '@app/common/entities';

import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @ManyToMany(() => RoomEntity, (room) => room.users, { onDelete: 'CASCADE' })
  @JoinTable()
  rooms: RoomEntity[];

  @ApiProperty()
  @Column()
  nickname: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column({ nullable: true })
  photo?: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
