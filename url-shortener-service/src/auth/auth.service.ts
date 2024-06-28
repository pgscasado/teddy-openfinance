import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthJWT } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async authenticate(email: string, password: string) {
    const user = await this.usersService.getByEmail(email);
    const exception = new UnauthorizedException('Email or password is wrong.');
    if (!user || !(await compare(password, user.pwd))) {
      throw exception;
    }
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    } satisfies AuthJWT);
  }
}
