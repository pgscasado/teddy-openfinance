import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { ZodTypeAny, z } from 'zod';

const usernameSchema = z
  .string()
  .min(3, { message: 'Username must have at least 3 characters' })
  .max(20, { message: 'Username must not exceed 20 characters' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username must only have alphanumeric characters and underscores',
  });

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must have at least 8 characters' })
  .max(100, { message: 'Password must not exceed 100 characters' })
  .regex(/[a-z]/, {
    message: 'Password must have at least one lowercase character',
  })
  .regex(/[A-Z]/, {
    message: 'Password must have at least one uppercase character',
  })
  .regex(/[0-9]/, { message: 'Password must have at least one number' })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must have at least one special character',
  });

export const createUserSchema = z.object({
  username: usernameSchema,
  pwd: passwordSchema,
} satisfies { [k in keyof Prisma.UserCreateInput]: ZodTypeAny });

export class CreateUserDTO implements z.infer<typeof createUserSchema> {
  @ApiProperty()
  username: string;
  @ApiProperty()
  pwd: string;
}
