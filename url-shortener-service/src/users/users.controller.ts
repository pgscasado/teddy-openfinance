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
import { ZodPipe } from '../zod/zod.pipe';
import * as UserSchemas from './user-schemas';
import { ZodFilter } from '../zod/zod.filter';
import { AuthGuard } from '../auth/auth.guard';
import { isAuthJWT } from '../auth/types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('')
  @UseFilters(ZodFilter)
  createUser(
    @Body(new ZodPipe(UserSchemas.createUserSchema))
    user: UserSchemas.CreateUserDTO,
  ) {
    return this.usersService.create(user);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUser(@Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.get(id);
  }

  @Delete('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteUser(@Req() req: Request) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.delete(id);
  }

  @Put('me')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUser(
    @Req() req: Request,
    @Body(new ZodPipe(UserSchemas.createUserSchema))
    data: UserSchemas.CreateUserDTO,
  ) {
    if (!isAuthJWT(req['jwt_payload'])) {
      throw new UnauthorizedException();
    }
    const id = req['jwt_payload'].sub;
    return this.usersService.update(id, data);
  }
}
