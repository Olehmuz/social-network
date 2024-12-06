import { DeepPartial } from '@app/utils/types/deep-partial.type';
import { NullableType } from '@app/utils/types/nullable.type';
import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { User } from '../../domain/user';

export abstract class UserRepository {
  abstract create(
    data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<User[]>;

  abstract findById(id: User['id']): Promise<NullableType<User>>;

  abstract findByIds(ids: User['id'][]): Promise<User[]>;

  abstract findByEmail(email: User['email']): Promise<NullableType<User>>;

  abstract update(
    id: User['id'],
    payload: DeepPartial<User>,
  ): Promise<User | null>;

  abstract remove(id: User['id']): Promise<void>;
}
