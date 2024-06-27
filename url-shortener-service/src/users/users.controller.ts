import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Req,
  UnauthorizedException,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodPipe } from 'src/zod/zod.pipe';
import * as UserSchemas from './user-schemas';
import { z } from 'zod';
import { ZodFilter } from 'src/zod/zod.filter';
import { AuthGuard } from 'src/auth/auth.guard';
import { isAuthJWT } from 'src/auth/types';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  @UseFilters(ZodFilter)
  createUser(
    @Body(new ZodPipe(UserSchemas.createUrlSchema))
    user: z.infer<typeof UserSchemas.createUrlSchema>,
  ) {
    return this.usersService.create(user);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  getUser(@Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.get(id);
  }

  @Delete('me')
  @UseGuards(AuthGuard)
  deleteUser(@Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.delete(id);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  updateUser(
    @Req() req: Request,
    @Body(new ZodPipe(UserSchemas.createUrlSchema))
    data: z.infer<typeof UserSchemas.createUrlSchema>,
  ) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.update(id, data);
  }
}
