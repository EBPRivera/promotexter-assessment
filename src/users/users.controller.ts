import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Prisma } from 'generated/prisma/client';
import { Role } from 'src/enums/role.enum';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common';

import type { IUserRequest } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() userInput: Prisma.UserCreateInput, @Request() request: IUserRequest) {
    const { role } = request.user

    if (role.toLowerCase() !== Role.Admin.toLowerCase()) {
      throw new ForbiddenException()
    }

    return this.usersService.create(userInput);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() userInput: Prisma.UserUpdateInput) {
    return this.usersService.update(+id, userInput);
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
