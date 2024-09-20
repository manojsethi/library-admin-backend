// src/auth/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'custom-jwt') {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          const token = req.cookies?.access_token; // Extract JWT from 'access_token' cookie
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET, // Use environment variable
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
