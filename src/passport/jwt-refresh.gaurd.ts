// src/auth/guards/jwt-auth.guard.ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('custom-refresh-jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    // Throw an error if authentication fails
    if (err || !user) {
      throw err || new UnauthorizedException('User not authorized');
    }

    // Attach the user to the request
    const request = context.switchToHttp().getRequest();
    request.user = user; // Attach the user object to the request

    // Return the user object for further processing in controllers
    return user;
  }
}
