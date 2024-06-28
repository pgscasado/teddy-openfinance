import { Body, Controller, Post, UseFilters, UsePipes } from '@nestjs/common';
import { ZodPipe } from 'src/zod/zod.pipe';
import { AuthenticationDTO, authenticationSchema } from './auth-schemas';
import { AuthService } from './auth.service';
import { ZodFilter } from 'src/zod/zod.filter';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('')
  @UseFilters(ZodFilter)
  @UsePipes(new ZodPipe(authenticationSchema))
  authenticate(@Body() data: AuthenticationDTO) {
    return this.authService.authenticate(data.username, data.password);
  }
}
