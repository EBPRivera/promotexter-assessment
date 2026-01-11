import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended'
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClient } from "../../generated/prisma/client";
import { Role } from "../enums/role.enum";

const usersArray = [
  { id: 1, username: "johndoe", password: "password", role: Role.User, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, username: "admin", password: "password", role: Role.Admin, createdAt: new Date(), updatedAt: new Date() }
]

const singleUser = usersArray[0]

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', () => {
      prismaMock.user.create.mockResolvedValue(singleUser)

      const { id, createdAt, updatedAt, ...createUser } = singleUser
      expect(service.create(createUser)).resolves.toEqual(singleUser)
    })
  })

  describe('findAll', () => {
    it('should return an array of users', async () => {
      prismaMock.user.findMany.mockResolvedValue(usersArray)

      const users = await service.findAll()
      expect(users).toEqual(usersArray)
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      prismaMock.user.findFirst.mockResolvedValue(singleUser)
      const user = await service.findOne(1)
      expect(user).toEqual(singleUser)
    })
  })

  describe('findByUsername', () => {
    it('should find a user by username', async () => {
      prismaMock.user.findFirst.mockResolvedValue(singleUser)
      const user = await service.findByUsername("johndoe")
      expect(user).toEqual(singleUser)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      prismaMock.user.update.mockResolvedValue(singleUser)
      const user = await service.update(1, { username: "johndoe" })
      expect(user).toEqual(singleUser)
    })
  })

  describe('remove', () => {
    it('should delete a user', async () => {
      await service.remove(1)
      expect(prismaMock.user.delete).toHaveBeenCalledTimes(1)
    })
  })
});