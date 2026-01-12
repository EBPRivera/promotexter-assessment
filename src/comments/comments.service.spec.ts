import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient, Comment } from '../../generated/prisma/client';

const comments: Comment[] = [
  { id: 1, content: "Content 1", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
  { id: 2, content: "Content 2", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
  { id: 3, content: "Content 3", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
]

describe('CommentsService', () => {
  let service: CommentsService;
  let prismaMock: DeepMockProxy<PrismaClient>

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createPostComment', () => {
    it('should create a post and connect it to a post and user', async () => {
      prismaMock.comment.create.mockResolvedValue(comments[0])
      await expect(service.createPostComment(1, 1, comments[0])).resolves.toEqual(comments[0])
      expect(prismaMock.post.update).toHaveBeenCalledTimes(1)
      expect(prismaMock.user.update).toHaveBeenCalledTimes(1)
    })

    it('should throw a BadRequestException user or post does not exist', async () => {
      prismaMock.post.update.mockImplementationOnce(() => { throw new Error() })
      prismaMock.user.update.mockImplementationOnce(() => { throw new Error() })
      await expect(service.createPostComment(1, 1, comments[0])).rejects
        .toThrow(BadRequestException)
    })
  })

  describe('findPostComments', () => {
    it('should return a list of comments from a post', async () => {
      prismaMock.comment.findMany.mockResolvedValue(comments)
      await expect(service.findPostComments(1)).resolves.toEqual(comments)
      expect(prismaMock.comment.findMany).toHaveBeenCalledWith({
        where: { postId: 1 }
      })
    })
  })

  describe('findOne', () => {
    it('should return a comment', async () => {
      prismaMock.comment.findFirst.mockResolvedValue(comments[0])
      await expect(service.findOne(1)).resolves.toEqual(comments[0])
      expect(prismaMock.comment.findFirst).toHaveBeenCalledWith({
        where: { id: 1 }
      })
    })
  })

  describe('update', () => {
    it('should update a comment', () => {
      prismaMock.comment.update.mockResolvedValue(comments[0])
      expect(service.update(1, 1, comments[0])).resolves.toEqual(comments[0])
    })

    it('should throw a BadRequestException if comment does not exist', async () => {
      prismaMock.comment.update.mockImplementationOnce(() => { throw new Error() })
      await expect(service.update(1, 1, comments[0])).rejects.toThrow(BadRequestException)
    })
  })

  describe('remove', () => {
    it('should delete a comment', async () => {
      prismaMock.comment.delete.mockResolvedValue(comments[0])
      await service.remove(1, 1)
      expect(prismaMock.comment.delete).toHaveBeenCalledTimes(1)
    })

    it('should throw a BadRequestException if comment does not exist', async () => {
      prismaMock.comment.delete.mockImplementationOnce(() => { throw new Error() })
      await expect(service.remove(1, 1)).rejects.toThrow(BadRequestException)
    })
  })

});
