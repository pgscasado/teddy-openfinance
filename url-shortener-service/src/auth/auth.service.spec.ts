import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient, User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { JwtModule } from '@nestjs/jwt';
import { hash, genSalt } from 'bcrypt';
import { jwtConstants } from './constants';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = await module.resolve<AuthService>(AuthService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    return expect(service).toBeDefined();
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
    return expect(service.authenticate(user.email, user.pwd)).resolves.toMatch(
      /^.*$/,
    );
  });

  it('should fail an authentication', () => {
    return expect(
      service.authenticate('email@naoexiste.com', 'naoexiste'),
    ).rejects.toEqual(new Error('Email or password is wrong.'));
  });
});
