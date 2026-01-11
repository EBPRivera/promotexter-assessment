import { Injectable, BadRequestException } from '@nestjs/common';
import { Prisma, Comment } from 'generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export interface ICommentSearchParams {
  where?: Prisma.CommentWhereInput
}

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async createPostComment(postId: number, userId: number, commentInput: Prisma.CommentCreateInput): Promise<void> {
    try {
      await this.prisma.post.update({
        where: { id: postId, userId },
        data: { comments: { create: commentInput } }
      })
    } catch {
      throw new BadRequestException()
    }
  }

  async findPostComments(postId: number): Promise<Comment[]> {
    const params: ICommentSearchParams = { where: { postId } }
    return this.prisma.comment.findMany(params)
  }

  async findOne(id: number): Promise<Comment> {
    return this.prisma.comment.findUniqueOrThrow({ where: { id } })
  }

  async update(id: number, userId: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    return await this.prisma.comment.update({
      where: { id, userId },
      data
    })
  }

  async remove(id: number, userId: number): Promise<void> {
    this.prisma.comment.delete({ where: { id, userId } })
  }
}
