import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NullableType } from '@app/utils/types/nullable.type';
import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { Message } from '@app/common';

import { MessageRepository } from '../../message.repository';
import { MessageEntity } from '../entities/message.entity';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessageRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
  ) {}

  async create(data: Message): Promise<Message> {
    const persistenceModel = MessageMapper.toPersistence(data);

    console.log('persistenceModel', persistenceModel);

    const newEntity = await this.messagesRepository.save(
      this.messagesRepository.create(persistenceModel),
    );

    console.log(newEntity);
    return MessageMapper.toDomain(newEntity);
  }

  async findByRoomId(roomId: string): Promise<Message[]> {
    const entities = await this.messagesRepository.find({
      where: { room: { id: roomId } },
      // relations: ['rooms'],
      relations: ['sender'],
    });

    console.log('entities', entities);

    return entities;
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]> {
    const entities = await this.messagesRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async findById(id: Message['id']): Promise<NullableType<Message>> {
    const entity = await this.messagesRepository.findOne({
      where: { id },
    });

    return entity ? MessageMapper.toDomain(entity) : null;
  }

  async update(id: Message['id'], payload: Partial<Message>): Promise<Message> {
    const entity = await this.messagesRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.messagesRepository.save(
      this.messagesRepository.create(
        MessageMapper.toPersistence({
          ...MessageMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return MessageMapper.toDomain(updatedEntity);
  }

  async remove(id: Message['id']): Promise<void> {
    await this.messagesRepository.delete(id);
  }

  async findAllByUserId(roomId: string): Promise<Message[]> {
    const entities = await this.messagesRepository.find({
      where: { room: { id: roomId } },
      relations: ['rooms'],
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }
}
