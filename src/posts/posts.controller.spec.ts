import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Post } from '../../generated/prisma/client';
import { Role } from '../enums/role.enum';

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

const userRequest = {
  user: {
    id: 1,
    username: "johndoe",
    role: Role.User
  }
}

const adminRequest = {
  user: {
    id: 1,
    username: "admin",
    role: Role.Admin
  }
}

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [PostsController],
      providers: [{
        provide: PostsService,
        useValue: {
          createUserPost: jest.fn().mockResolvedValue(posts[0]),
          findAll: jest.fn().mockResolvedValue(posts),
          findOne: jest.fn().mockResolvedValue(posts[0]),
          update: jest.fn().mockResolvedValue(posts[0]),
          remove: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', () => {
      expect(controller.create(posts[0], userRequest)).resolves.toEqual(posts[0])
    })
  })

  describe('findAll', () => {
    it('should return a list of posts', () => {
      expect(controller.findAll({})).resolves.toEqual(posts)
    })
  })

  describe('findOne', () => {
    it('should return a post', () => {
      expect(controller.findOne("an id")).resolves.toEqual(posts[0])
    })
  })

  describe('update', () => {
    it('should update a post', () => {
      expect(controller.update("an id", posts[0], userRequest)).resolves.toEqual(posts[0])
    })
  })

  describe('delete', () => {
    it('should delete a post', async () => {
      await controller.remove("an id", adminRequest)
      expect(service.remove).toHaveBeenCalledTimes(1)
    })
  })
});
