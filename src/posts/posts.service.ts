import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Post, Prisma } from 'generated/prisma/client';

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

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data })
  }

  async findAll(params: IPostSearchParams): Promise<Post[]> {
    return this.prisma.post.findMany(params)
  }

  async findOne(id: number): Promise<Post> {
    return this.prisma.post.findFirstOrThrow({ where: { id } })
  }

  async update(id: number, data: Prisma.PostUpdateInput): Promise<Post> {
    return this.prisma.post.update({ where: { id }, data })
  }

  async remove(id: number): Promise<void> {
    this.prisma.post.delete({ where: { id } })
  }
}
