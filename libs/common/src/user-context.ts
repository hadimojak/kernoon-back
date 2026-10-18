import { UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

export const USER_ID_HEADER = 'x-user-id';
export const USER_ROLE_HEADER = 'x-user-role';
export const CART_ID_HEADER = 'x-cart-id';

export function requireUserId(req: Request): string {
  const userId = req.header(USER_ID_HEADER);
  if (!userId) {
    throw new UnauthorizedException('Missing user context');
  }
  return userId;
}
