import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma, Comment } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface ICommentSearchParams {
  where?: Prisma.CommentWhereInput
}

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) { }

  async createPostComment(postId: number, userId: number, commentInput: Prisma.CommentCreateInput): Promise<Comment> {
    try {
      const comment = await this.prisma.comment.create({ data: commentInput })

      // Link to post and user
      const connectQuery = { connect: { id: comment.id } }
      await this.prisma.post.update({
        where: { id: postId },
        data: { comments: connectQuery }
      })
      await this.prisma.user.update({
        where: { id: userId },
        data: { comments: connectQuery}
      })

      return comment
    } catch {
      throw new BadRequestException()
    }
  }

  async findPostComments(postId: number): Promise<Comment[]> {
    const params: ICommentSearchParams = { where: { postId } }
    return this.prisma.comment.findMany(params)
  }

  async findOne(id: number): Promise<Comment | null> {
    return this.prisma.comment.findFirst({ where: { id } })
  }

  async update(id: number, userId: number, data: Prisma.CommentUpdateInput): Promise<Comment> {
    try {
      return await this.prisma.comment.update({
        where: { id, userId },
        data
      })
    } catch {
      throw new NotFoundException()
    }
  }

  async remove(id: number, userId: number | undefined): Promise<void> {
    try { 
      await this.prisma.comment.delete({ where: { id, userId } })
    } catch {
      throw new NotFoundException()
    }
  }
}
