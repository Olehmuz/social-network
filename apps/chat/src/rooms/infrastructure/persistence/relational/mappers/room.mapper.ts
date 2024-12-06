import { Room } from '@app/common/domain';
import { RoomEntity } from '@app/common/entities';

import { UserMapper } from '../../../../../../../auth/src/users/infrastructure/persistence/relational/mappers/room.mapper';

export class RoomMapper {
  static toDomain(raw: RoomEntity): Room {
    const domainEntity = new Room();
    domainEntity.id = raw.id;
    domainEntity.name = raw.name;
    if (raw.users?.length) {
      domainEntity.users = raw.users.map((user) => {
        return UserMapper.toDomain(user);
      });
    }
    domainEntity.users = raw.users;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Room): RoomEntity {
    const persistenceEntity = new RoomEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.name = domainEntity.name;
    if (domainEntity.users.length) {
      persistenceEntity.users = domainEntity.users.map((user) => {
        return UserMapper.toPersistence(user);
      });
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
