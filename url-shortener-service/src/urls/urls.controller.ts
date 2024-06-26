import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ZodPipe } from 'src/zod/zod.pipe';
import * as UrlsSchemas from './urls-schemas';
import { z } from 'zod';
import { Response } from 'express';

@Controller('')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Delete(':id')
  async deleteUrl(@Param('id') id: string) {
    return await this.urlsService.delete(+id);
  }

  @Post()
  async createUrl(
    @Body(new ZodPipe(UrlsSchemas.getUrlSchema))
    createUrlDto: z.infer<typeof UrlsSchemas.getUrlSchema>,
  ) {
    return this.urlsService.create(createUrlDto);
  }

  @Get()
  async getAllUrls() {
    return this.urlsService.getUrls();
  }

  @Get(':shortUrl')
  async redirectToUrl(
    @Param('shortUrl') shortened: string,
    @Res() res: Response,
  ) {
    const originalUrl = await this.urlsService.redirect(shortened);
    res.redirect(originalUrl);
  }
}
