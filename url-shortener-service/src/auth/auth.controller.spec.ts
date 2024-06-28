import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { genSalt, hash } from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { jwtConstants } from './constants';

describe('AuthController', () => {
  let controller: AuthController;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, UsersService, PrismaService],
      imports: [
        JwtModule.register({
          global: true,
          secret: jwtConstants.secret,
          signOptions: { expiresIn: '10m' },
        }),
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<AuthController>(AuthController);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    return expect(controller).toBeDefined();
  });

  it('should authenticate an user', async () => {
    async function hashPassword(password: string) {
      const saltRounds = 10;
      return hash(password, await genSalt(saltRounds));
    }
    const user: User = {
      id: 1,
      email: 'joaosilva@email.com',
      username: 'joao',
      pwd: '123456Joao!',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };
    const createdUser: User = { ...user, pwd: await hashPassword(user.pwd) };
    prisma.user.findFirst.mockResolvedValueOnce(createdUser);
    return expect(
      controller.authenticate({ email: user.email, password: user.pwd }),
    ).resolves.toMatch(/^.*$/);
  });
});
