import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';

@Module({
  providers: [UrlsService],
  controllers: [UrlsController],
})
export class UrlsModule {}
