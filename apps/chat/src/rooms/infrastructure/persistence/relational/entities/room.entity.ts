import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  ManyToMany,
} from 'typeorm';

import { UserEntity } from '@app/common/entities';

import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';

@Entity({
  name: 'room',
})
export class RoomEntity extends EntityRelationalHelper {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.rooms)
  users: UserEntity[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
