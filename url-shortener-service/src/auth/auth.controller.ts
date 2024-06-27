import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { ZodPipe } from 'src/zod/zod.pipe';
import { authenticationSchema } from './auth-schemas';
import { z } from 'zod';
import { AuthService } from './auth.service';
import { ZodFilter } from 'src/zod/zod.filter';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('')
  @UseFilters(ZodFilter)
  authenticate(
    @Body(new ZodPipe(authenticationSchema))
    data: z.infer<typeof authenticationSchema>,
  ) {
    return this.authService.authenticate(data.username, data.password);
  }
}
