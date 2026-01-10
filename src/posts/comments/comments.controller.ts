import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Prisma } from 'generated/prisma/client';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  createPostComment(@Param('post_id') postId: string, @Body() commentInput: Prisma.CommentCreateInput) {
    return this.commentsService.createPostComment(+postId, commentInput);
  }

  @Get()
  findPostComments(@Param('post_id') postId: string) {
    return this.commentsService.findPostComments(+postId);
  }

  @Get(':comment_id')
  findOne(@Param('comment_id') commentId: string) {
    return this.commentsService.findOne(+commentId);
  }

  @Patch(':comment_id')
  update(@Param('comment_id') id: string, @Body() updateInput: Prisma.CommentUpdateInput) {
    return this.commentsService.update(+id, updateInput);
  }

  @Delete(':comment_id')
  remove(@Param('comment_id') id: string) {
    return this.commentsService.remove(+id);
  }
}
