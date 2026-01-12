import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PostsService } from './posts.service';
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClient, Post } from '../../generated/prisma/client';
import { Role } from "../enums/role.enum";

const posts: Post[] = [
  {
    id: 1,
    title: "Title 1",
    content: "Content 1",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null
  },
  {
    id: 2,
    title: "Title 2",
    content: "Content 2",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null
  },
  {
    id: 3,
    title: "Title 3",
    content: "Content 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: null
  }
]

const user = {
  id: 1,
  username: "johndoe",
  password: "password",
  role: Role.User,
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('PostsService', () => {
  let service: PostsService;
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUserPost', () => {
    it('should create a post and connect it to user', async () => {
      prismaMock.post.create.mockResolvedValue(posts[0])
      await expect(service.createUserPost(1, posts[0])).resolves.toEqual(posts[0])
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1)
    })
  })

  describe('findAll', () => {
    it('should return all posts', () => {
      prismaMock.post.findMany.mockResolvedValue(posts)
      expect(service.findAll({})).resolves.toEqual(posts)
    })
  })

  describe('findOne', () => {
    it('should return a posts', async () => {
      prismaMock.post.findFirst.mockResolvedValue(posts[0])
      expect(service.findOne(1)).resolves.toEqual(posts[0])
    })
  })

  describe('update', () => {
    it('should update a post', () => {
      prismaMock.post.update.mockResolvedValue(posts[0])
      expect(service.update(1, 1, posts[0])).resolves.toEqual(posts[0])
    })
    
    it('should throw a BadRequestException if post does not exist', async () => {
      prismaMock.post.update.mockImplementationOnce(() => { throw new Error })
      await expect(service.update(1, 1, posts[0])).rejects.toThrow(BadRequestException)
    })
  })

  describe('remove', () => { 
    it('should remove a post', async () => {
      await service.remove(undefined, 1)
      expect(prismaMock.post.delete).toHaveBeenCalledTimes(1)
    })

    it('should throw a BadRequestException if post does not exist', async () => {
      prismaMock.post.delete.mockImplementationOnce(() => { throw new Error })
      await expect(service.remove(undefined, 1)).rejects.toThrow(BadRequestException)
    })
  })
});
