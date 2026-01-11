import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Prisma } from '../../generated/prisma/client';
import { Role } from '../enums/role.enum';
import { JwtAuthGuard } from '../auth/jwt.guard';

import type { IUserRequest } from '../interfaces/user-request';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Prisma.UserCreateInput, @Request() request: IUserRequest) {
    const { role } = request.user

    if (role.toLowerCase() !== Role.Admin.toLowerCase()) {
      throw new ForbiddenException()
    }

    return this.usersService.create(body);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: Prisma.UserUpdateInput,
    @Request() request: IUserRequest,
  ) {
    const { role } = request.user

    if (role.toLowerCase() !== Role.Admin.toLowerCase() && +id != request.user.id) {
      throw new BadRequestException()
    }

    return this.usersService.update(+id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: IUserRequest) {
    const { role } = request.user

    if (role.toLowerCase() !== Role.Admin.toLowerCase()) {
      throw new ForbiddenException()
    }

    return this.usersService.remove(+id);
  }
}
