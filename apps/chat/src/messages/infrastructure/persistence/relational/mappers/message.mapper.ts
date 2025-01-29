import { MessageEntity } from '@app/common/entities';
import { RoomMapper, UserMapper } from '@app/common/mappers';

import { Message } from '../../../../domain/message';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const domainEntity = new Message();
    domainEntity.id = raw.id;
    domainEntity.room = raw.room;
    if (raw.undeliveredUsers?.length) {
      domainEntity.undeliveredUsers = raw.undeliveredUsers.map((user) => {
        return UserMapper.toDomain(user);
      });
    }
    if (raw.unreadUsers?.length) {
      domainEntity.unreadUsers = raw.unreadUsers.map((user) => {
        return UserMapper.toDomain(user);
      });
    }
    domainEntity.sender = UserMapper.toDomain(raw.sender);
    domainEntity.message = raw.message;
    domainEntity.imageUrl = raw.imageUrl;

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageEntity {
    const persistenceEntity = new MessageEntity();
    persistenceEntity.id = domainEntity.id;
    persistenceEntity.room = RoomMapper.toPersistence(domainEntity.room);
    if (domainEntity.undeliveredUsers.length) {
      persistenceEntity.undeliveredUsers = domainEntity.undeliveredUsers.map(
        (undeliveredUsers) => {
          return UserMapper.toPersistence(undeliveredUsers);
        },
      );
    }

    if (domainEntity.unreadUsers.length) {
      persistenceEntity.unreadUsers = domainEntity.unreadUsers.map(
        (unreadUsers) => {
          return UserMapper.toPersistence(unreadUsers);
        },
      );
    }

    persistenceEntity.sender = UserMapper.toPersistence(domainEntity.sender);
    persistenceEntity.message = domainEntity.message;
    persistenceEntity.imageUrl = domainEntity.imageUrl;

    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
