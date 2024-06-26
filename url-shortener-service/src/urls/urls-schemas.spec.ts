import { Test, TestingModule } from '@nestjs/testing';
import { UrlsSchemas } from './urls-schemas';

describe('UrlsSchemas', () => {
  let provider: UrlsSchemas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsSchemas],
    }).compile();

    provider = module.get<UrlsSchemas>(UrlsSchemas);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
