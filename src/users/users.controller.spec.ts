import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { Role } from "../enums/role.enum";

const usersArray = [
  { id: 1, username: "johndoe", password: "password", role: Role.User, createdAt: new Date(), updatedAt: new Date() },
  { id: 2, username: "admin", password: "password", role: Role.Admin, createdAt: new Date(), updatedAt: new Date() }
]

const userRole = { user: usersArray[0] }
const adminRole = { user: usersArray[1] }
const singleUser = usersArray[0]

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule, JwtModule],
      controllers: [UsersController],
      providers: [{
        provide: UsersService,
        useValue: {
          create: jest.fn().mockResolvedValue(singleUser),
          findAll: jest.fn().mockResolvedValue(usersArray),
          findOne: jest.fn().mockResolvedValue(singleUser),
          findByUsername: jest.fn().mockResolvedValue(singleUser),
          update: jest.fn().mockResolvedValue(singleUser),
          remove: jest.fn(),
        }
      }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user as an admin', async () => {
      await expect(controller.create(singleUser, adminRole)
      ).resolves.toEqual(singleUser)
    })

    it('should throw a ForbiddenException as a regular user', async () => {
      expect(() => { controller.create(singleUser, userRole) }).toThrow(ForbiddenException)
    })
  })

  describe('findAll', () => {
    it('should return a list of users', () => {
      expect(controller.findAll()).resolves.toEqual(usersArray)
    })
  })

  describe('findOne', () => {
    it('should return a user', () => {
      expect(controller.findOne('an id')).resolves.toEqual(singleUser)
    })
  })

  describe('update', () => {
    it('should update the user', () => {
      expect(controller.update('1', singleUser, userRole)).resolves.toEqual(singleUser)
      expect(controller.update('1', singleUser, adminRole)).resolves.toEqual(singleUser)
    })

    it('should throw a BadRequestException when trying to update a different user as a non-admin', () => {
      expect(() => { controller.update('2', singleUser, userRole) }).toThrow(BadRequestException)
    })
  })

  describe('remove', () => {
    it('should delete the user', async () => {
      const deleteSpy = jest.spyOn(service, 'remove')
      await controller.remove('1', adminRole)
      expect(deleteSpy).toHaveBeenCalledTimes(1)
    })

    it('should throw a ForbiddenException when trying to delete as a non-admin', () => {
      expect(() => { controller.remove('1', userRole) }).toThrow(ForbiddenException)
    })
  })
});
