import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
export const createUrlSchema = z.object({
  originalUrl: z.string(),
});

export const updateUrlSchema = z.object({
  originalUrl: z.string(),
});

export class CreateURLDTO implements z.infer<typeof createUrlSchema> {
  @ApiProperty()
  originalUrl: string;
}

export class UpdateURLDTO implements z.infer<typeof updateUrlSchema> {
  @ApiProperty()
  originalUrl: string;
}
