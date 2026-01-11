import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from 'generated/prisma/client';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const { password, ...userInput } = data

    // Generate hashed password
    const salt = await genSalt()
    const hashedPassword = await hash(password, salt)

    // Save new user
    const newUser: Prisma.UserCreateInput = {
      password: hashedPassword,
      ...userInput
    }

    return this.prisma.user.create({ data: newUser })
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany()
  }

  async findOne(id: number): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id }
    })
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.prisma.user.findFirst({
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
