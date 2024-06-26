import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';

describe('Urls', () => {
  let provider: UrlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService],
    }).compile();

    provider = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
