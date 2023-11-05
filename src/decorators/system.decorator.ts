import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Req } from '../types/request';

export const RequestSystem = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Req>();
    return request.system;
  },
);
