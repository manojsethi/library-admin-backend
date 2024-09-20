// src/auth/decorators/roles.decorator.ts
import { SetMetadata, applyDecorators } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const REQUIRE_ALL_KEY = 'requireAll';

export const Roles = (roles: string[], requireAll = false) =>
  applyDecorators(
    SetMetadata(ROLES_KEY, roles),
    SetMetadata(REQUIRE_ALL_KEY, requireAll),
  );
