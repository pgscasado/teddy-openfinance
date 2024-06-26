import { Prisma } from '@prisma/client';

export const softDeleteExtension = Prisma.defineExtension((client) =>
  client.$extends({
    name: 'softDelete',
    query: {
      async $allOperations({ model, args, operation, query }) {
        // // async findFirst<TModel, TArgs extends Prisma.Args<TModel, 'findFirst'>>(
        // //   this: TModel,
        // //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findFirst'>>,
        // // ) {
        // //   const context = Prisma.getExtensionContext(this);
        // //   args['where'] = {
        // //     ...args['where'],
        // //     deletedAt: null,
        // //   };
        // //   return (context as any).findFirst(args);
        // // },
        // // async findFirstOrThrow<TModel, TArgs>(
        // //   this: TModel,
        // //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findFirstOrThrow'>>,
        // // ) {
        // //   const context = Prisma.getExtensionContext(this);
        // //   args['where'] = {
        // //     ...args['where'],
        // //     deletedAt: null,
        // //   };
        // //   return (context as any).findFirstOrThrow(args);
        // // },
        // async findMany<TModel, TArgs extends Prisma.Args<TModel, 'findMany'>>(
        //   this: TModel[],
        //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findMany'>>,
        // ) {
        //   const context = Prisma.getExtensionContext(this);
        //   args['data'] = {
        //     deletedAt: new Date(),
        //   };
        //   return args.query(args);
        // },
        // // async findUnique<TModel, TArgs extends Prisma.Args<TModel, 'findUnique'>>(
        // //   this: TModel,
        // //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findUnique'>>,
        // // ) {
        // //   const context = Prisma.getExtensionContext(this);
        // //   args['where'] = {
        // //     ...args['where'],
        // //     deletedAt: null,
        // //   };
        // //   return (context as any).findUnique(args);
        // // },
        // // async findUniqueOrThrow<TModel, TArgs>(
        // //   this: TModel,
        // //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'findUniqueOrThrow'>>,
        // // ) {
        // //   const context = Prisma.getExtensionContext(this);
        // //   args['where'] = {
        // //     ...args['where'],
        // //     deletedAt: null,
        // //   };
        // //   return (context as any).findUniqueOrThrow(args);
        // // },
        // async deleteMany<TModel, TArgs>(
        //   this: TModel[],
        //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'deleteMany'>>,
        // ) {
        //   const [context] = Prisma.getExtensionContext(this);
        //   args['data'] = {
        //     deletedAt: new Date(),
        //   };
        //   return await client.$transaction([(context as any).findMany(args)]);
        // },
        // async delete<TModel, TArgs extends Prisma.Args<TModel, 'delete'>>(
        //   this: TModel,
        //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'delete'>>,
        // ) {
        //   const context = Prisma.getExtensionContext(this);
        //   args['data'] = {
        //     deletedAt: new Date(),
        //   };
        //   return (context as any).update(args);
        // },
        // async update<TModel, TArgs extends Prisma.Args<TModel, 'update'>>(
        //   this: TModel,
        //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'update'>>,
        // ) {
        //   const context = Prisma.getExtensionContext(this);
        //   args['where'] = {
        //     ...args['where'],
        //     deletedAt: null,
        //   };
        //   return (context as any).update(args);
        // },
        // async updateMany<TModel, TArgs>(
        //   this: TModel,
        //   args: Prisma.Exact<TArgs, Prisma.Args<TModel, 'updateMany'>>,
        // ) {
        //   const context = Prisma.getExtensionContext(this);
        //   args['where'] = {
        //     ...args['where'],
        //     deletedAt: null,
        //   };
        //   return (context as any).updateMany(args);
        // },
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
