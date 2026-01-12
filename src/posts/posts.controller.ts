import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Prisma, Post as TPost } from '../../generated/prisma/client';
import { Role } from '../enums/role.enum';

import type { IPostSearchParams } from './posts.service';
import type { IUserRequest } from '../interfaces/user-request';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() body: Prisma.PostCreateInput,
    @Request() request: IUserRequest
  ): Promise<TPost> {
    return await this.postsService.createUserPost(request.user.id, body);
  }

  @Get()
  findAll(@Body() postParameters: IPostSearchParams) {
    return this.postsService.findAll(postParameters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Prisma.PostUpdateInput,
    @Request() request: IUserRequest
  ): Promise<TPost> {
    return await this.postsService.update(+id, request.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Request() request: IUserRequest): Promise<void> {
    const { role } = request.user
    var userId: number | undefined

    if (role.toLowerCase() !== Role.Admin.toLowerCase()) {
      userId = request.user.id
    }

    return await this.postsService.remove(userId, +id);
  }
}
