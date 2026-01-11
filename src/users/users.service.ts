import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from 'generated/prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findFirstOrThrow({
      where: { id }
    })
  }

  async findByUsername(username: string) {
    return this.prisma.user.findFirstOrThrow({
      where: { username }
    })
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data
    })
  }

  async remove(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }
}
