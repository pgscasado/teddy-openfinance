import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const user: Prisma.UserCreateInput = {
        email: 'test@example.com',
        username: 'testuser',
        pwd: 'plaintextpassword',
      };
      const hashedPassword = await hash(user.pwd, 10);
      const now = new Date();
      prisma.user.create.mockResolvedValue({
        id: 1,
        ...user,
        pwd: hashedPassword,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });

      const result = await service.create(user);

      expect(result).toEqual({
        id: 1,
        ...user,
        pwd: hashedPassword,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
      });
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          ...user,
          pwd: expect.any(String),
        },
      });
      expect(result.pwd).not.toBe(user.pwd);
    });
  });

  describe('get', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        pwd: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.user.findFirst.mockResolvedValue(user);

      const result = await service.get(userId);

      expect(result).toEqual(user);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const user = {
        id: 1,
        email,
        username: 'testuser',
        pwd: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.user.findFirst.mockResolvedValue(user);

      const result = await service.getByEmail(email);

      expect(result).toEqual(user);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('getByUsername', () => {
    it('should return a user by username', async () => {
      const username = 'testuser';
      const user = {
        id: 1,
        email: 'test@example.com',
        username,
        pwd: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.user.findFirst.mockResolvedValue(user);

      const result = await service.getByUsername(username);

      expect(result).toEqual(user);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe('list', () => {
    it('should return a list of users', async () => {
      const users = [
        {
          id: 1,
          email: 'test1@example.com',
          username: 'testuser1',
          pwd: 'hashedpassword1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          email: 'test2@example.com',
          username: 'testuser2',
          pwd: 'hashedpassword2',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      prisma.user.findMany.mockResolvedValue(users);

      const result = await service.list();

      expect(result).toEqual(users);
      expect(prisma.user.findMany).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a user by id', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@example.com',
        username: 'testuser',
        pwd: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.user.delete.mockResolvedValue(user);

      const result = await service.delete(userId);

      expect(result).toEqual(user);
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });

  describe('update', () => {
    it('should update a user by id', async () => {
      const userId = 1;
      const userData: Prisma.UserUpdateInput = {
        email: 'new@example.com',
        username: 'newusername',
      };
      const updatedUser = {
        id: userId,
        email: 'new@example.com',
        username: 'newusername',
        pwd: 'hashedpassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      prisma.user.update.mockResolvedValue(updatedUser);

      const result = await service.update(userId, userData);

      expect(result).toEqual(updatedUser);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: userData,
      });
    });
  });
});
