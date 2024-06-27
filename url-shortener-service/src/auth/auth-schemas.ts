import { z } from 'zod';

export const authenticationSchema = z.object({
  username: z.string().min(1, 'Username is empty'),
  password: z.string().min(1, 'Password is empty'),
});
