import { EntityRelationalHelper } from '@app/utils/relational-entity-helper';
import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends EntityRelationalHelper {
  @ApiProperty()
  @Column()
  nickname: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty()
  @Column()
  photo: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
