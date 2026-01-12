import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const access_token = "sample_token"

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: {
          signIn: jest.fn().mockResolvedValue({ access_token }),
          signUp: jest.fn()
        }
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService)
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return the user\'s access_token', () => {
      expect(controller.signIn({ username: "johndoe", password: "password" }))
        .resolves.toEqual({ access_token })
    })
  })

  describe('signUp', () => {
    it('should create a user', async () => {
      await controller.signUp({
        username: "johndoe", password: "password", confirmPassword: "password"
      })
      expect(service.signUp).toHaveBeenCalledTimes(1)
    })
  })
});
