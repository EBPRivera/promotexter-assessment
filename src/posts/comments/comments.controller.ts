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
import { Prisma } from 'generated/prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

import type { IUserRequest } from 'src/auth/jwt.guard';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  createPostComment(
    @Param('post_id') postId: string,
    @Body() commentInput: Prisma.CommentCreateInput,
    @Request() request: IUserRequest
  ) {
    return this.commentsService.createPostComment(+postId, request.user.id, commentInput);
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
  update(
    @Param('comment_id') id: string,
    @Body() updateInput: Prisma.CommentUpdateInput,
    @Request() request: IUserRequest
  ) {
    return this.commentsService.update(+id, request.user.id, updateInput);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':comment_id')
  remove(@Param('comment_id') id: string, @Request() request: IUserRequest) {
    return this.commentsService.remove(+id, request.user.id);
  }
}
