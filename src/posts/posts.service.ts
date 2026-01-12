import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Post, Prisma } from '../../generated/prisma/client';

export interface IPostSearchParams {
  skip?: number;
  take?: number;
  cursor?: Prisma.PostWhereUniqueInput;
  where?: Prisma.PostWhereInput;
  orderBy?: Prisma.PostOrderByWithRelationInput;
}

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async createUserPost(userId: number, data: Prisma.PostCreateInput): Promise<Post> {
    // Create Post
    const post = await this.prisma.post.create({ data })

    // Associate Post to User
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        posts: { connect: { id: post.id } }
      }
    })

    return post
  }

  async findAll(params: IPostSearchParams): Promise<Post[]> {
    return await this.prisma.post.findMany(params)
  }

  async findOne(id: number): Promise<Post | null> {
    return await this.prisma.post.findFirst({ where: { id } })
  }

  async update(id: number, userId: number, data: Prisma.PostUpdateInput): Promise<Post> {
    try {
      return await this.prisma.post.update({ where: { id, userId }, data })
    } catch {
      throw new BadRequestException()
    }
  }

  async remove(userId: number | undefined, id: number): Promise<void> {
    try {
      await this.prisma.post.delete({ where: { id, userId } })
    } catch {
      throw new BadRequestException()
    }
  }
}
