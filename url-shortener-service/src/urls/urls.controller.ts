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
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UrlsService } from './urls.service';
import { ZodPipe } from 'src/zod/zod.pipe';
import * as UrlsSchemas from './urls-schemas';
import { z } from 'zod';
import { Response } from 'express';
import { ZodFilter } from 'src/zod/zod.filter';
import { AuthGuard, LooseAuth } from 'src/auth/auth.guard';
import { isAuthJWT } from 'src/auth/types';

@Controller('')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Delete(':shortUrl')
  @UseGuards(AuthGuard)
  async deleteUrl(@Param('shortUrl') shortened: string, @Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException('Must be logged in to see all your URLs');
    }
    return await this.urlsService.delete(shortened, req['jwt_payload'].sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @LooseAuth(true)
  @UseFilters(ZodFilter)
  async createUrl(
    @Body(new ZodPipe(UrlsSchemas.createUrlSchema))
    createUrlDto: z.infer<typeof UrlsSchemas.createUrlSchema>,
    @Req() req: Request,
  ) {
    const createInput: Parameters<typeof this.urlsService.create>[0] =
      createUrlDto;
    if (isAuthJWT(req['jwt_payload'])) {
      createInput['owner'] = {
        connect: {
          id: req['jwt_payload'].sub,
        },
      };
    }
    return this.urlsService.create(createInput);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllUrls(@Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException('Must be logged in to see all your URLs');
    }
    return this.urlsService.getUrls(req['jwt_payload'].sub);
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
  @UseGuards(AuthGuard)
  async inspectShortUrl(
    @Param('shortUrl') shortened: string,
    @Req() req: Request,
  ) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    return this.urlsService.getUrl(shortened, req['jwt_payload'].sub);
  }

  @Put(':shortUrl')
  @UseFilters(ZodFilter)
  @UseGuards(AuthGuard)
  async editUrl(
    @Param('shortUrl') shortened: string,
    @Body(new ZodPipe(UrlsSchemas.updateUrlSchema))
    data: z.infer<typeof UrlsSchemas.updateUrlSchema>,
    @Req() req: Request,
  ) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    return this.urlsService.update(shortened, req['jwt_payload'].sub, data);
  }
}
