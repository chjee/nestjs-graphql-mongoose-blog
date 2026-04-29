import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from './roles.guard';

class TestResolver {
  open() {
    return null;
  }

  @Roles('ADMIN')
  adminOnly() {
    return null;
  }
}

const createContext = (
  handlerName: keyof TestResolver,
  role?: string,
): ExecutionContext =>
  ({
    getType: () => 'graphql',
    getClass: () => TestResolver,
    getHandler: () => TestResolver.prototype[handlerName],
    getArgs: () => [
      undefined,
      undefined,
      { req: { user: { role } } },
      undefined,
    ],
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;

  beforeEach(() => {
    rolesGuard = new RolesGuard(new Reflector());
  });

  it('allows handlers without role metadata', () => {
    expect(rolesGuard.canActivate(createContext('open'))).toBe(true);
  });

  it('allows users with a required role', () => {
    expect(rolesGuard.canActivate(createContext('adminOnly', 'ADMIN'))).toBe(
      true,
    );
  });

  it('rejects users without a required role', () => {
    expect(rolesGuard.canActivate(createContext('adminOnly', 'USER'))).toBe(
      false,
    );
  });
});
