// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'custom-refresh-jwt',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies?.refresh_token; // Extract JWT from 'access_token' cookie
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_REFRESH_SECRET, // Use environment variable
    });
  }
  //   constructor(private authService: AuthService) {
  //     super({
  //       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //       ignoreExpiration: false,
  //       secretOrKey: process.env.JWT_SECRET, // Use environment variable
  //     });
  //   }

  async validate(payload: any) {
    const user = await this.authService.validateUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // Attach the user object to the request
  }
}
