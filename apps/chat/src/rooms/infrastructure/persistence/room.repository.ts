import { DeepPartial } from '@app/utils/types/deep-partial.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { Room } from '../../domain/room';

export abstract class RoomRepository {
  abstract create(
    data: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Room>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Room[]>;

  abstract findById(id: Room['id']): Promise<NullableType<Room>>;

  abstract update(
    id: Room['id'],
    payload: DeepPartial<Room>,
  ): Promise<Room | null>;

  abstract remove(id: Room['id']): Promise<void>;

  abstract findAllByUserId(userId: string): Promise<Room[]>;
}
