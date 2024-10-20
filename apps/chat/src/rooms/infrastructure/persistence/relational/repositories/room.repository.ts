import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@app/utils/types/nullable.type';
import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { Room } from '../../../../domain/room';
import { RoomRepository } from '../../room.repository';
import { RoomEntity } from '../entities/room.entity';
import { RoomMapper } from '../mappers/room.mapper';

@Injectable()
export class RoomRelationalRepository implements RoomRepository {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly userRepository: Repository<RoomEntity>,
  ) {}

  async create(data: Room): Promise<Room> {
    const persistenceModel = RoomMapper.toPersistence(data);
    const newEntity = await this.userRepository.save(
      this.userRepository.create(persistenceModel),
    );
    return RoomMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Room[]> {
    const entities = await this.userRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => RoomMapper.toDomain(entity));
  }

  async findById(id: Room['id']): Promise<NullableType<Room>> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    return entity ? RoomMapper.toDomain(entity) : null;
  }

  async update(id: Room['id'], payload: Partial<Room>): Promise<Room> {
    const entity = await this.userRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.userRepository.save(
      this.userRepository.create(
        RoomMapper.toPersistence({
          ...RoomMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return RoomMapper.toDomain(updatedEntity);
  }

  async remove(id: Room['id']): Promise<void> {
    await this.userRepository.delete(id);
  }
}
