import { z } from 'zod';
export const createUrlSchema = z.object({
  originalUrl: z.string(),
});

export const updateUrlSchema = z.object({
  originalUrl: z.string(),
});
