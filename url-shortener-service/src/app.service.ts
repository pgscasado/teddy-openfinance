import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello() {
    return new Promise<string>((resolve) => resolve('Hello World!'));
  }
}
