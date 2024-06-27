import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseFilters,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ZodPipe } from 'src/zod/zod.pipe';
import * as UrlsSchemas from './urls-schemas';
import { z } from 'zod';
import { Response } from 'express';
import { ZodFilter } from 'src/zod/zod.filter';

@Controller('')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Delete(':shortUrl')
  async deleteUrl(@Param('shortUrl') shortened: string) {
    return await this.urlsService.delete(shortened);
  }

  @Post()
  @UseFilters(ZodFilter)
  async createUrl(
    @Body(new ZodPipe(UrlsSchemas.createUrlSchema))
    createUrlDto: z.infer<typeof UrlsSchemas.createUrlSchema>,
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
    @Req() req: Request,
    @Ip() ipAddress: string,
  ) {
    const { referrer, headers } = req;
    const originalUrl = await this.urlsService.redirect(shortened, {
      ipAddress,
      referrer: referrer || '',
      userAgent: headers['user-agent'] || '',
    });
    res.redirect(originalUrl);
  }

  @Get('inspect/:shortUrl')
  async inspectShortUrl(@Param('shortUrl') shortened: string) {
    return this.urlsService.getUrl(shortened);
  }

  @Put(':shortUrl')
  @UseFilters(ZodFilter)
  async editUrl(
    @Param('shortUrl') shortened: string,
    @Body(new ZodPipe(UrlsSchemas.updateUrlSchema))
    data: z.infer<typeof UrlsSchemas.updateUrlSchema>,
  ) {
    return this.urlsService.update(shortened, data);
  }
}
