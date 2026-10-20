import { ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { requireUserId, USER_ROLE_HEADER } from '@app/common';

export function requireSeller(req: Request) {
  const sellerId = requireUserId(req);
  const role = req.header(USER_ROLE_HEADER);
  if (role !== 'seller' && role !== 'masterSeller') {
    throw new ForbiddenException('Seller access only');
  }
  return sellerId;
}
