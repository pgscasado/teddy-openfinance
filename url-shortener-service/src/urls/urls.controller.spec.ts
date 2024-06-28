import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import e from 'express';

describe('UrlsController', () => {
  let controller: UrlsController;
  let urlsService: DeepMockProxy<UrlsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [UrlsService, PrismaService, JwtService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .overrideProvider(UrlsService)
      .useValue(mockDeep<UrlsService>())
      .compile();

    controller = module.get<UrlsController>(UrlsController);
    urlsService = module.get(UrlsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deleteUrl', () => {
    it('should delete a URL when user is authenticated', async () => {
      const req = {
        jwt_payload: { sub: 1 },
      } as unknown as globalThis.Request;
      const shortened = 'abc123';
      urlsService.delete.mockResolvedValueOnce(undefined);

      await controller.deleteUrl(shortened, req);
      expect(urlsService.delete).toHaveBeenCalledWith(shortened, 1);
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const req = { jwt_payload: null } as unknown as globalThis.Request;
      const shortened = 'abc123';

      await expect(controller.deleteUrl(shortened, req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('createUrl', () => {
    it('should create a URL when user is authenticated', async () => {
      const req = {
        jwt_payload: { sub: 1 },
      } as unknown as globalThis.Request;
      const createUrlDto = { originalUrl: 'http://example.com' };
      urlsService.create.mockResolvedValueOnce('http://localhost/b');

      const result = await controller.createUrl(createUrlDto, req);

      expect(result).toEqual({ url: 'http://localhost/b' });
      expect(urlsService.create).toHaveBeenCalledWith({
        ...createUrlDto,
        owner: { connect: { id: 1 } },
      });
    });

    it('should create a URL when user is not authenticated', async () => {
      const req = { jwt_payload: null } as unknown as globalThis.Request;
      const createUrlDto = { originalUrl: 'http://example.com' };
      urlsService.create.mockResolvedValueOnce('http://localhost/b');

      const result = await controller.createUrl(createUrlDto, req);

      expect(result).toEqual({ url: 'http://localhost/b' });
      expect(urlsService.create).toHaveBeenCalledWith(createUrlDto);
    });
  });

  describe('getAllUrls', () => {
    it('should get all URLs when user is authenticated', async () => {
      const req = {
        jwt_payload: { sub: 1 },
      } as unknown as globalThis.Request;
      const urls = [
        {
          id: 1,
          originalUrl: 'http://example.com',
          url: 'localhost/b',
          urlAcesses: 0,
        },
      ];
      urlsService.getUrls.mockResolvedValueOnce(urls);

      const result = await controller.getAllUrls(req);

      expect(result).toEqual(urls);
      expect(urlsService.getUrls).toHaveBeenCalledWith(1);
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const req = { jwt_payload: null } as unknown as globalThis.Request;

      await expect(controller.getAllUrls(req)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('redirectToUrl', () => {
    it('should redirect to original URL', async () => {
      const req = {
        headers: { 'user-agent': 'test-agent' },
        referrer: 'http://referrer.com',
      } as unknown as globalThis.Request;
      const res = { redirect: jest.fn() } as unknown as e.Response;
      const shortened = 'abc123';
      const originalUrl = 'http://example.com';
      urlsService.redirect.mockResolvedValueOnce(originalUrl);

      await controller.redirectToUrl(shortened, res, req, '127.0.0.1');

      expect(urlsService.redirect).toHaveBeenCalledWith(shortened, {
        ipAddress: '127.0.0.1',
        referrer: 'http://referrer.com',
        userAgent: 'test-agent',
      });
      expect(res['redirect']).toHaveBeenCalledWith(originalUrl);
    });
  });

  describe('editUrl', () => {
    it('should edit a URL when user is authenticated', async () => {
      const req = {
        jwt_payload: { sub: 1 },
      } as unknown as globalThis.Request;
      const shortened = 'abc123';
      const updateUrlDto = { originalUrl: 'http://example2.com' };
      const updatedUrl = { id: 1, originalUrl: 'http://example2.com' };
      urlsService.update.mockResolvedValueOnce({
        ...updatedUrl,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      });

      const result = await controller.editUrl(shortened, updateUrlDto, req);

      expect(result).toHaveProperty('originalUrl', updatedUrl.originalUrl);
      expect(urlsService.update).toHaveBeenCalledWith(
        shortened,
        1,
        updateUrlDto,
      );
    });

    it('should throw UnauthorizedException when user is not authenticated', async () => {
      const req = { jwt_payload: null } as unknown as globalThis.Request;
      const shortened = 'abc123';
      const updateUrlDto = { originalUrl: 'http://example2.com' };

      await expect(
        controller.editUrl(shortened, updateUrlDto, req),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
