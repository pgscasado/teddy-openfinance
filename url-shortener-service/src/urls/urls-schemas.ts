import { z } from 'zod';
export const getUrlSchema = z.object({
  originalUrl: z.string(),
});
