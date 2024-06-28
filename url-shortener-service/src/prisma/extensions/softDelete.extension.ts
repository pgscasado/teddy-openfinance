import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'softDelete',
    query: {
      async $allOperations({ model, args, operation, query }) {
        const executor = client[model!.toLowerCase()] as typeof client.url;
        switch (operation) {
          case 'findFirst':
          case 'findFirstOrThrow':
          case 'findMany':
          case 'findUnique':
          case 'findUniqueOrThrow':
          case 'update':
          case 'updateMany':
            args['where'] = {
              ...(args['where'] || {}),
              deletedAt: null,
            };
            break;
          case 'delete':
          case 'deleteMany':
            args['where'] = {
              ...(args['where'] || {}),
              deletedAt: null,
            };
            args['data'] = {
              deletedAt: new Date(),
            };
            return executor.updateMany(args);
        }
        return query(args);
      },
    },
  }),
);
