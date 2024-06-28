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
import { ZodPipe } from '../zod/zod.pipe';
import * as UrlsSchemas from './urls-schemas';
import { Response } from 'express';
import { ZodFilter } from '../zod/zod.filter';
import { AuthGuard, LooseAuth } from '../auth/auth.guard';
import { isAuthJWT } from '../auth/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('')
@ApiTags('urls')
export class UrlsController {
  constructor(private urlsService: UrlsService) {}

  @Delete(':shortUrl')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  async deleteUrl(@Param('shortUrl') shortened: string, @Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException('Must be logged in to see all your URLs');
    }
    return await this.urlsService.delete(shortened, req['jwt_payload'].sub);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @LooseAuth(true)
  @UseFilters(ZodFilter)
  async createUrl(
    @Body(new ZodPipe(UrlsSchemas.createUrlSchema))
    createUrlDto: UrlsSchemas.CreateURLDTO,
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
    return { url: await this.urlsService.create(createInput) };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  async editUrl(
    @Param('shortUrl') shortened: string,
    @Body(new ZodPipe(UrlsSchemas.updateUrlSchema))
    data: UrlsSchemas.UpdateURLDTO,
    @Req() req: Request,
  ) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    return this.urlsService.update(shortened, req['jwt_payload'].sub, data);
  }
}
