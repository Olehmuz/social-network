import { DeepPartial } from '@app/utils/types/deep-partial.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { Message } from '../../domain/message';

export abstract class MessageRepository {
  abstract create(
    data: Omit<Message, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Message>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Message[]>;

  abstract findById(id: Message['id']): Promise<NullableType<Message>>;

  abstract update(
    id: Message['id'],
    payload: DeepPartial<Message>,
  ): Promise<Message | null>;

  abstract remove(id: Message['id']): Promise<void>;

  abstract findAllByUserId(userId: string): Promise<Message[]>;
}
