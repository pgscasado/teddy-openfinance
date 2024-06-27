import { Prisma } from '@prisma/client';
import { ZodTypeAny, z } from 'zod';
export const createUrlSchema = z.object({
  username: z.string(),
  pwd: z.string(),
} satisfies { [k in keyof Prisma.UserCreateInput]: ZodTypeAny });
