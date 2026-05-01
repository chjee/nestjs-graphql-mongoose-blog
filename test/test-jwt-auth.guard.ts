import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { IS_PUBLIC_KEY } from '../src/common/decorators/public.decorator';

@Injectable()
export class TestJwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const authorization = req.headers.authorization?.replace('Bearer ', '');

    if (!authorization) {
      return false;
    }

    const [role, userId = '6576d6d44441e8ea8a38b5a8'] =
      authorization.split(':');

    req.user = {
      role,
      userId,
      name: 'Test User',
    };

    return true;
  }
}
