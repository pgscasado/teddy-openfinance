import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { Request } from 'express';
import { AuthJWT } from './types';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest() as Request;
    const loose = this.reflector.get<boolean>('loose', context.getHandler());
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      if (loose) {
        return true;
      } else {
        throw new UnauthorizedException('Missing authorization');
      }
    }
    try {
      const payload: AuthJWT = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });
      req['jwt_payload'] = payload;
    } catch (e) {
      throw new UnauthorizedException('Invalid authorization');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

export const LooseAuth =
  (looseGuard: boolean = false) =>
  (target: object, key?: any, descriptor?: any) => {
    Reflect.defineMetadata('loose', looseGuard, descriptor.value);
  };
