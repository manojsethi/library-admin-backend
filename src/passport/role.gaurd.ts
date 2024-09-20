// src/auth/guards/roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ALL_KEY, ROLES_KEY } from '../decorators/roles.decorator';
import { JwtAuthGuard } from './jwt.gaurd'; // Assuming JwtAuthGuard is correctly implemented

@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Retrieve required roles and requireAll flag from the route's metadata
    const requiredRoles = this.reflector.get<string[]>(
      ROLES_KEY,
      context.getHandler(),
    );
    const requireAll =
      this.reflector.get<boolean>(REQUIRE_ALL_KEY, context.getHandler()) ||
      false;

    if (!requiredRoles) {
      return true; // No roles required, grant access
    }

    if (!user || !user.roles) {
      throw new ForbiddenException('User does not have roles');
    }

    // Check if user has required roles based on the requireAll flag
    const hasRole = (role: string) => user.roles.includes(role);
    const hasRequiredRoles = requireAll
      ? requiredRoles.every(hasRole) // User must have all roles
      : requiredRoles.some(hasRole); // User must have at least one role

    if (!hasRequiredRoles) {
      throw new ForbiddenException(
        'Insufficient roles to access this resource',
      );
    }

    return true;
  }
}
