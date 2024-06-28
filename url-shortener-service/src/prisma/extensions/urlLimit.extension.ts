import { HttpException, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export const urlLimitExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'urlLimit',
    query: {
      url: {
        async create({ args, query }) {
          if ((await client.url.count()) === 56800235583) {
            throw new HttpException(
              'short URL quantity limit reached',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
          return query(args);
        },
        async upsert({ args, query }) {
          if ((await client.url.count()) === 56800235583) {
            throw new HttpException(
              'short URL quantity limit reached',
              HttpStatus.TOO_MANY_REQUESTS,
            );
          }
          return query(args);
        },
      },
    },
  }),
);
