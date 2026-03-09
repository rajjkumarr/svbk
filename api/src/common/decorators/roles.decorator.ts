import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Assigns allowed roles to a route.
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
