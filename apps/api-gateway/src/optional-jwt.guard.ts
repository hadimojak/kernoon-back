import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@app/contracts';
import { GatewayRequest } from './gateway.service';

type AccessToken = {
  sub: string;
  email: string;
  role: Role;
  typ?: string;
  masterSellerId?: string;
};

@Injectable()
export class OptionalJwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<GatewayRequest>();
    const header = req.headers.authorization;
    if (!header) return true;
    if (!header.startsWith('Bearer ')) throw new UnauthorizedException();
    try {
      const payload = this.jwt.verify<AccessToken>(
        header.slice('Bearer '.length),
      );
      if (payload.typ !== 'access') throw new UnauthorizedException();
      req.user = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
        masterSellerId:
          payload.masterSellerId ||
          (payload.role === 'masterSeller' ? payload.sub : undefined),
      };
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
