import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import {
  CART_ID_HEADER,
  MASTER_SELLER_ID_HEADER,
  ServiceClient,
  ServiceName,
  serviceUrls,
  USER_ID_HEADER,
  USER_ROLE_HEADER,
} from '@app/common';
import { Role } from '@app/contracts';

export type GatewayUser = {
  id: string;
  email: string;
  role: Role;
  masterSellerId?: string;
};

export type GatewayRequest = Request & { user?: GatewayUser };

@Injectable()
export class GatewayService {
  constructor(private readonly client: ServiceClient) {}

  forward(service: ServiceName, req: GatewayRequest, path: string) {
    const headers: Record<string, string | undefined> = {};
    if (req.user) {
      headers[USER_ID_HEADER] = req.user.id;
      headers[USER_ROLE_HEADER] = req.user.role;
      if (req.user.masterSellerId) {
        headers[MASTER_SELLER_ID_HEADER] = req.user.masterSellerId;
      }
    }
    const cartId = req.header(CART_ID_HEADER);
    if (cartId) headers[CART_ID_HEADER] = cartId;

    const sendsBody = !['GET', 'HEAD', 'DELETE'].includes(req.method);
    return this.client.send({
      baseUrl: serviceUrls()[service],
      service,
      method: req.method,
      path,
      body: sendsBody ? req.body : undefined,
      query: queryOf(req),
      headers,
    });
  }
}

function queryOf(req: Request) {
  const query: Record<string, string | undefined> = {};
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string') query[key] = value;
  }
  return query;
}
