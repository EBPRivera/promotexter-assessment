import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Prisma, Comment } from 'generated/prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Role } from 'src/enums/role.enum';

import type { IUserRequest } from '../interfaces/user-request';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPostComment(
    @Param('post_id') postId: string,
    @Body() body: Prisma.CommentCreateInput,
    @Request() request: IUserRequest
  ) {
    return this.commentsService.createPostComment(+postId, request.user.id, body);
  }

  @Get()
  findPostComments(@Param('post_id') postId: string) {
    return this.commentsService.findPostComments(+postId);
  }

  @Get(':comment_id')
  findOne(@Param('comment_id') commentId: string) {
    return this.commentsService.findOne(+commentId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':comment_id')
  async update(
    @Param('comment_id') commentId: string,
    @Body() body: Prisma.CommentUpdateInput,
    @Request() request: IUserRequest
  ): Promise<Comment> {
    return await this.commentsService.update(+commentId, request.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':comment_id')
  async remove(@Param('comment_id') commentId: string, @Request() request: IUserRequest): Promise<void> {
    const { role } = request.user
    var userId: number | undefined
     
    if (role.toLowerCase() !== Role.Admin.toLowerCase()) {
      userId = request.user.id
    }
    
    await this.commentsService.remove(+commentId, userId);
  }
}
