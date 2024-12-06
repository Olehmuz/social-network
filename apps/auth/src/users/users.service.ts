import { Injectable } from '@nestjs/common';

import { IPaginationOptions } from '@app/utils/types/pagination-options';

import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './infrastructure/persistence/user.repository';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.userRepository.create(createUserDto);
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.userRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findOneByUserId(id: User['id']) {
    return this.userRepository.findById(id);
  }

  findUsersByIds(ids: User['id'][]) {
    return this.userRepository.findByIds(ids);
  }

  findUserByEmail(email: User['email']) {
    return this.userRepository.findByEmail(email);
  }

  update(id: User['id'], updateUserDto: UpdateUserDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: User['id']) {
    return this.userRepository.remove(id);
  }
}
