import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Res,
  Req,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { Csrf, Msg } from './interfaces/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/csrf')
  getCsrfToken(@Req() req: Request): Csrf {
    return { csrfToken: req.csrfToken() };
  }
  // これはheaderに入れないとcsrfを突破することができない

  @Post('signup')
  signUp(@Body() dto: AuthDto): Promise<Msg> {
    // req.bodyを取り出すときに@Body()する
    // 実態はemailとpassのオブジェクト
    // でビジネスロジックはserviceに任せているので処理はこれだけでok
    return this.authService.signUp(dto);
  }

  @HttpCode(HttpStatus.OK) // postはnestの仕様で201になるが「作成する」とloginは意図が違うので200で返すためのデコレータ
  @Post('login')
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Msg> {
    const jwt = await this.authService.login(dto);
    // サーバー側でcookieを設定する
    res.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      secure: true, // 動作確認の時はfalseにする（sameSiteの関係）postmanではfalseにする,cookieの送受信で必要
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Msg {
    res.cookie('access_token', '', {
      httpOnly: true,
      secure: true, // 動作確認の時はfalseにする（sameSiteの関係）postmanではfalseにする,cookieの送受信で必要
      sameSite: 'none',
      path: '/',
    });
    return {
      message: 'ok',
    };
  }
}
