import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('UsersController', () => {
  let controller: UsersController;
  let service: DeepMockProxy<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, PrismaService, JwtService],
    })
      .overrideProvider(UsersService)
      .useValue(mockDeep<UsersService>())
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDTO = {
        username: 'test',
        email: 'test@example.com',
        pwd: 'password',
      };
      const createdUser = { id: 1, ...createUserDTO };
      service.create.mockResolvedValue(createdUser as any);
      expect(await controller.createUser(createUserDTO)).toBe(createdUser);
      expect(service.create).toHaveBeenCalledWith(createUserDTO);
    });
  });

  describe('getUser', () => {
    it('should return the current user', async () => {
      const userId = 1;
      const user = {
        id: userId,
        username: 'test',
        email: 'test@example.com',
        pwd: 'password',
      };
      const req = { jwt_payload: { sub: userId } } as any;

      service.get.mockResolvedValue(user as any);

      expect(await controller.getUser(req)).toBe(user);
      expect(service.get).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException if jwt_payload is invalid', () => {
      const req = { jwt_payload: null } as any;

      expect(() => controller.getUser(req)).toThrow(UnauthorizedException);
    });
  });

  describe('deleteUser', () => {
    it('should delete the current user', async () => {
      const userId = 1;
      const req = { jwt_payload: { sub: userId } } as any;

      service.delete.mockResolvedValue({} as any);

      expect(await controller.deleteUser(req)).toEqual({});
      expect(service.delete).toHaveBeenCalledWith(userId);
    });

    it('should throw UnauthorizedException if jwt_payload is invalid', () => {
      const req = { jwt_payload: null } as any;

      expect(() => controller.deleteUser(req)).toThrow(UnauthorizedException);
    });
  });

  describe('updateUser', () => {
    it('should update the current user', async () => {
      const userId = 1;
      const updateUserDTO = {
        username: 'newtest',
        email: 'newtest@example.com',
        pwd: 'newpassword',
      };
      const updatedUser = { id: userId, ...updateUserDTO };
      const req = { jwt_payload: { sub: userId } } as any;

      service.update.mockResolvedValue(updatedUser as any);

      expect(await controller.updateUser(req, updateUserDTO)).toBe(updatedUser);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDTO);
    });

    it('should throw UnauthorizedException if jwt_payload is invalid', () => {
      const req = { jwt_payload: null } as any;

      expect(() => controller.updateUser(req, {} as any)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
