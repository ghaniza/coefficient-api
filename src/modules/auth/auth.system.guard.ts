import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Req } from '../../types/request';

@Injectable()
export class AuthSystemGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Req>();
    const token = request.headers['authorization'] as string;

    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.authService.validateAPIToken(token);
      request.system = {
        ...payload,
        unique: undefined,
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
