import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '@app/utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '@app/utils/infinity-pagination';
import { RpcErrorInterceptor } from '@app/utils/interceptors/rpc-error.interceptor';

import { User } from './domain/user';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(User),
  })
  async findAll(
    @Query() query: FindAllUsersDto,
  ): Promise<InfinityPaginationResponseDto<User>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.usersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: User,
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOneByUserId(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: User,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @UseInterceptors(RpcErrorInterceptor)
  @MessagePattern({ cmd: 'user.find.by.ids' })
  async findUsersByIds(@Payload() userIds: string[]): Promise<User[]> {
    return this.usersService.findUsersByIds(userIds);
  }

  @UseInterceptors(RpcErrorInterceptor)
  @MessagePattern({ cmd: 'user.get.all' })
  async getUsers(): Promise<User[]> {
    return this.usersService.findAll();
  }
}
