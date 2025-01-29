import { User } from '@app/common/domain';
import { UserEntity } from '@app/common/entities';

export class UserMapper {
  static toDomain(raw: UserEntity): User {
    const domainEntity = new User();
    domainEntity.nickname = raw.nickname;
    domainEntity.password = raw.password;
    domainEntity.email = raw.email;
    domainEntity.photo = raw.photo;
    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserEntity {
    const persistenceEntity = new UserEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.nickname = domainEntity.nickname;
    persistenceEntity.password = domainEntity.password;
    persistenceEntity.photo = domainEntity.photo;
    persistenceEntity.email = domainEntity.email;
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
