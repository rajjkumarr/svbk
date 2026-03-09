import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Extracts the current user from the request (after auth guard).
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? user?.[data] : user;
  },
);
