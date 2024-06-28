import { PrismaClient } from '@prisma/client';

import { softDeleteExtension } from './extensions/softDelete.extension';
import { urlLimitExtension } from './extensions/urlLimit.extension';

function extendClient(base: PrismaClient) {
  return base.$extends(softDeleteExtension).$extends(urlLimitExtension);
}

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: ConstructorParameters<typeof PrismaClient>[0]) {
    super(options);

    return extendClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendClient>;

export { ExtendedPrismaClient };
