import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UrlsService {
  constructor(private prisma: PrismaService) {}

  async create(urlData: Prisma.UrlCreateInput) {
    if (
      !['http://', 'https://'].some((p) => urlData.originalUrl.startsWith(p))
    ) {
      urlData.originalUrl = `https://${urlData.originalUrl}`;
    }
    const newUrl = await this.prisma.url.create({ data: urlData });
    return this.idToShortened(newUrl.id);
  }

  async getUrls() {
    return (
      await this.prisma.url.findMany({
        include: {
          _count: {
            select: {
              urlAcesses: true,
            },
          },
        },
      })
    ).map(({ id, _count: { urlAcesses } }) => ({
      id,
      url: `${process.env.BASE_URL}/${this.idToShortened(id)}`,
      urlAcesses,
    }));
  }

  async getUrl(shortened: string) {
    return this.prisma.url.findFirst({
      where: {
        id: this.shortenedToId(shortened),
      },
      include: {
        urlAcesses: true,
      },
    });
  }

  async redirect(
    shortUrl: string,
    { userAgent, ipAddress, referrer }: Prisma.UrlAccessCreateWithoutUrlInput,
  ) {
    const url = await this.prisma.url.update({
      where: { id: this.shortenedToId(shortUrl) },
      data: {
        urlAcesses: {
          create: {
            userAgent,
            ipAddress,
            referrer,
          },
        },
      },
      select: {
        originalUrl: true,
      },
    });
    if (!url) {
      throw new NotFoundException('Url does not exist');
    }
    return url.originalUrl;
  }

  async delete(shortened: string) {
    return new Promise<void>(async (resolve) => {
      await this.prisma.url.deleteMany({
        where: { id: this.shortenedToId(shortened) },
      });
      resolve();
    });
  }

  async update(shortened: string, data: Prisma.UrlUpdateInput) {
    return this.prisma.url.update({
      where: {
        id: this.shortenedToId(shortened),
      },
      data,
    });
  }

  private alphabet =
    'abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVXYZ1234567890';
  private idToShortened(id: number): string {
    const output: string[] = [];
    while (id) {
      output.push(this.alphabet[id % 62]);
      id = Math.floor(id / 62);
    }
    return output.slice().reverse().join('');
  }
  private shortenedToId(shortUrl) {
    let id = 0;
    for (let i = 0; i < shortUrl.length; i++) {
      if ('a' <= shortUrl[i] && shortUrl[i] <= 'z') {
        id = id * 62 + shortUrl[i].charCodeAt(0) - 'a'.charCodeAt(0);
      }
      if ('A' <= shortUrl[i] && shortUrl[i] <= 'Z') {
        id = id * 62 + shortUrl[i].charCodeAt(0) - 'A'.charCodeAt(0) + 26;
      }
      if ('0' <= shortUrl[i] && shortUrl[i] <= '9') {
        id = id * 62 + shortUrl[i].charCodeAt(0) - '0'.charCodeAt(0) + 52;
      }
    }
    return id;
  }
}
