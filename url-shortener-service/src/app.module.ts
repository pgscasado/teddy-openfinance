import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UrlsModule } from './urls/urls.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaFilter } from './prisma/prisma.filter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    UrlsModule,
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController],
  providers: [
    AppService,
    PrismaService,
    UsersService,
    {
      provide: APP_FILTER,
      useClass: PrismaFilter,
    },
  ],
})
export class AppModule {}
