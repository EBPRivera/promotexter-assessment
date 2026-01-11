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
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Prisma } from 'generated/prisma/client';

import type { IPostSearchParams } from './posts.service';
import type { IUserRequest } from 'src/auth/jwt.guard';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() postInput: Prisma.PostCreateInput, @Request() request: IUserRequest) {
    return this.postsService.createUserPost(request.user.id, postInput);
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
  update(@Param('id') id: string, @Body() postInput: Prisma.PostUpdateInput, @Request() request: IUserRequest) {
    return this.postsService.update(+id, request.user.id, postInput);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Request() request: IUserRequest) {
    return this.postsService.remove(request.user.id, +id);
  }
}
