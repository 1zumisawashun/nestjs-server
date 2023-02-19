import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // PassportStrategyという抽象クラスをextendsする
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    // ここのコンストラクタでjwtからpayloadを復元してvalidateに回す（ので引数はpayloadになる）
    // ここをライブラリの内部でやっているので抽象メソッドとして使用者に強制して使わせているのか。
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          // プロジェクトによってトークンがどこに格納されているか変わるためここで宣言する必要がある
          // 今回の場合はheaderではなくcookieにはいっているので下記のようにする
          let jwt = null;
          if (req && req.cookies) {
            jwt = req.cookies['access_token'];
          }
          return jwt;
        },
      ]),
      ignoreExpiration: false, // expireだったら弾く
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  // payloadはauthSurviceで宣言している
  async validate(payload: { sub: number; email: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return user;
  }
}
