import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
// csurfは正規のサイトからリクエストがあったか検証する

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true })); // dtoに定義していないフィールドが送られてきたら省いてくれる
  app.enableCors({
    credentials: true, //cookieベースでjwtのやりとりをするのでつける
    origin: ['http://localhost:3000'], // whitelistにlocalohost3000を登録する
  });
  app.use(cookieParser());
  await app.listen(3005);
}
bootstrap();
