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
    origin: ['http://localhost:3000'], // whitelistにlocalhost3000を登録する
  });
  app.use(cookieParser());
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: 'none',
        secure: false, // 動作確認の時はfalseにする（sameSiteの関係）postmanではfalseにする,cookieの送受信で必要
      },
      value: (req: Request) => {
        return req.header('csrf-token');
      },
    }),
  );
  await app.listen(process.env.POST || 3005);
}
bootstrap();
