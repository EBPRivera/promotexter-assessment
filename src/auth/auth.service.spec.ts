import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { Role } from "../enums/role.enum"
import { User } from '../../generated/prisma/client';

const user: User = {
  id: 1,
  username: "johndoe",
  password: "password",
  role: Role.User,
  createdAt: new Date(),
  updatedAt: new Date()
}

const access_token = "sample_token"

jest.mock('bcrypt', () => ({
  // compare: jest.fn().mockResolvedValue(true)
  compare: jest.fn().mockImplementation(async (firstPassword, secondPassword) => {
    return firstPassword === secondPassword
  })
}))

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByUsername: jest.fn().mockResolvedValue(user),
            create: jest.fn().mockResolvedValue(user)
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue(access_token)
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    const login = { username: "johndoe", password: "password" }

    it('should return the user\'s access_token', () => {
      expect(service.signIn(login)).resolves.toEqual({ access_token })
    })

    it('should return a NotFoundException if user does not exist', async () => {
      jest.spyOn(usersService, 'findByUsername').mockResolvedValueOnce(null)
      await expect(service.signIn(login)).rejects.toThrow(NotFoundException)
    })

    it('it should return UnauthorizedException if password is incorrect', async () => {
      await expect(service.signIn({ username: "johndoe", password: "wrong-password" }))
        .rejects.toThrow(UnauthorizedException)
    })
  })

  describe('signUp', () => {
    it('should create a user', async () => {
      await service.signUp({
        username: "johndoe", password: "password", confirmPassword: "password"
      })
      expect(usersService.create).toHaveBeenCalledTimes(1)
    })

    it('should throw a BadRequestException if password and confirmPassword do not match', () => {
      expect(service.signUp({
        username: "johndoe",
        password: "password",
        confirmPassword: "wrong-password"
      })).rejects.toThrow(BadRequestException)
    })
  })
});
