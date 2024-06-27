import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { genSalt, hash } from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: Prisma.UserCreateInput) {
    async function hashPassword(password: string) {
      const saltRounds = 10;
      return hash(password, await genSalt(saltRounds));
    }
    user.pwd = await hashPassword(user.pwd);
    return this.prisma.user.create({
      data: user,
    });
  }

  get(id: number) {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async list() {
    return this.prisma.user.findMany();
  }

  async delete(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }

  async update(id: number, userData: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data: userData,
    });
  }
}
