// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { LoginService } from '../login.service';

// export type JwtPayload = { sub: string; email?: string; roles?: string[] };

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly loginService: LoginService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('jwt.secret'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const user = await this.loginService.validatePayload(payload);
//     if (!user) {
//       throw new UnauthorizedException('Invalid or expired token');
//     }
//     return {
//       sub: user.id,
//       email: user.email,
//       roles: [user.role],
//     };
//   }
// }
