import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Role } from '../enums/role.enum';
import { Comment } from '../../generated/prisma/client';

const comments: Comment[] = [
  { id: 1, content: "Content 1", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
  { id: 2, content: "Content 2", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
  { id: 3, content: "Content 3", createdAt: new Date(), updatedAt: new Date(), postId: 1, userId: 1 },
]

const userRequest = {
  user: {
    id: 1,
    username: "johndoe",
    role: Role.User
  }
}

describe('CommentsController', () => {
  let controller: CommentsController;
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [CommentsController],
      providers: [{
        provide: CommentsService,
        useValue: {
          createPostComment: jest.fn().mockResolvedValue(comments[0]),
          findPostComments: jest.fn().mockResolvedValue(comments),
          findOne: jest.fn().mockResolvedValue(comments[0]),
          update: jest.fn().mockResolvedValue(comments[0]),
          remove: jest.fn()
        }
      }],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createPostComment', () => {
    it('should create a comment', () => {
      expect(controller.createPostComment('an id', comments[0], userRequest)).resolves.toEqual(comments[0])
    })
  })

  describe('findPostComments', () => {
    it('should return a list of comments from a post', () => {
      expect(controller.findPostComments('an id')).resolves.toEqual(comments)
    })
  })

  describe('findOne', () => {
    it('should return a comment', () => {
      expect(controller.findOne('an id')).resolves.toEqual(comments[0])
    })
  })

  describe('update', () => {
    it('should update a comment', () => {
      expect(controller.update('an id', comments[0], userRequest)).resolves.toEqual(comments[0])
    })
  })

  describe('remove', () => {
    it('should delete a comment', async () => {
      await controller.remove("an id", userRequest)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
  })
});
