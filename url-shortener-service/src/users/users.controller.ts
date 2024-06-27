import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ZodPipe } from 'src/zod/zod.pipe';
import * as UserSchemas from './user-schemas';
import { z } from 'zod';
import { ZodFilter } from 'src/zod/zod.filter';

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

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.usersService.get(+id);
  }

  @Get('')
  getAllUsers() {
    return this.usersService.list();
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.delete(+id);
  }

  @Put(':id')
  updateUser(
    @Param('id') id: string,
    @Body(new ZodPipe(UserSchemas.createUrlSchema))
    data: z.infer<typeof UserSchemas.createUrlSchema>,
  ) {
    return this.usersService.update(+id, data);
  }
}
