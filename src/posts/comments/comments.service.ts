import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Prisma, Comment } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ICommentSearchParams {
  where?: Prisma.CommentWhereInput
}

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async createPostComment(postId: number, commentInput: Prisma.CommentCreateInput): Promise<void> {
    this.prisma.post.update({
      where: { id: postId },
      data: { comments: { create: commentInput } }
    })
  }

  async findPostComments(postId: number): Promise<Comment[]> {
    const params: ICommentSearchParams = { where: { postId } }
    return this.prisma.comment.findMany(params)
  }

  async findOne(id: number): Promise<Comment> {
    return this.prisma.comment.findUniqueOrThrow({ where: { id } })
  }

  async update(id: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return this.prisma.comment.update({
      where: { id },
      data
    })
  }

  async remove(id: number): Promise<void> {
    this.prisma.comment.delete({ where: { id } })
  }
}
