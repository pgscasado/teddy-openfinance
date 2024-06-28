import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { PrismaService } from '../prisma/prisma.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';

describe('UrlsService', () => {
  let service: UrlsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    process.env.BASE_URL = 'localhost';
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<UrlsService>(UrlsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    return expect(service).toBeDefined();
  });

  it('should create a short URL', () => {
    const urlData = {
      originalUrl: 'google.com',
    };
    prisma.url.create.mockResolvedValueOnce({
      id: 1,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: new Date(),
      ownerId: null,
      ...urlData,
    });
    return expect(service.create(urlData)).resolves.toMatch(
      new RegExp(`^localhost/b$`),
    );
  });

  it('should encode a number correctly', () => {
    return expect(service['idToShortened'](300)).toEqual('e0');
  });
});
