import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

export const authenticationSchema = z.object({
  email: z.string().email('Email is invalid'),
  password: z.string().min(1, 'Password is empty'),
});

export class AuthenticationDTO implements z.infer<typeof authenticationSchema> {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
