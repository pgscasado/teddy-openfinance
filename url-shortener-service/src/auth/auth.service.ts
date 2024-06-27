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

  async authenticate(username: string, password: string) {
    const user = await this.usersService.getByUsername(username);
    const exception = new UnauthorizedException(
      'Username or password is wrong.',
    );
    if (!user || !(await compare(password, user.pwd))) {
      throw exception;
    }
    return this.jwtService.signAsync({
      sub: user.id,
      username,
    } satisfies AuthJWT);
  }
}
