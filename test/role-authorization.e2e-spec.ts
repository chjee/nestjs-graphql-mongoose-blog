import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  INestApplication,
  Injectable,
} from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as request from 'supertest';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { UsersResolver } from '../src/users/users.resolver';
import { UsersService } from '../src/users/users.service';
import { PostsService } from '../src/posts/posts.service';
import { ProfilesService } from '../src/profiles/profiles.service';
import { createGraphqlTestApp } from './graphql-test-app';

@Injectable()
class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    const role = req.headers.authorization?.replace('Bearer ', '');

    if (!role) {
      return false;
    }

    req.user = {
      role,
      userId: 'test-user-id',
      name: 'Test User',
    };

    return true;
  }
}

describe('Role authorization (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    id: '6576d6d44441e8ea8a38b5a8',
    name: 'Alice',
    email: 'alice@prisma.io',
    role: 'ADMIN',
  };

  const usersService = {
    create: jest.fn(() => mockUser),
    findAll: jest.fn(() => [mockUser]),
    findOne: jest.fn(() => mockUser),
    update: jest.fn(() => mockUser),
    remove: jest.fn(() => mockUser),
  };

  beforeAll(async () => {
    app = await createGraphqlTestApp([
      UsersResolver,
      RolesGuard,
      { provide: UsersService, useValue: usersService },
      { provide: PostsService, useValue: { findAll: jest.fn(() => []) } },
      { provide: ProfilesService, useValue: { findOne: jest.fn(() => null) } },
      { provide: APP_GUARD, useClass: TestJwtAuthGuard },
      { provide: APP_GUARD, useExisting: RolesGuard },
    ]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('rejects updateUserRole for USER role tokens', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          mutation {
            updateUserRole(
              id: "6576d6d44441e8ea8a38b5a8",
              updateUserRoleInput: { role: "ADMIN" }
            ) {
              id
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual({ updateUserRole: null });
        expect(body.errors?.[0]?.message).toBe('Forbidden resource');
        expect(usersService.update).not.toHaveBeenCalled();
      });
  });

  it('allows updateUserRole for ADMIN role tokens', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            updateUserRole(
              id: "6576d6d44441e8ea8a38b5a8",
              updateUserRoleInput: { role: "ADMIN" }
            ) {
              id
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.errors).toBeUndefined();
        expect(body.data).toEqual({
          updateUserRole: {
            id: mockUser.id,
            role: mockUser.role,
          },
        });
        expect(usersService.update).toHaveBeenCalledWith({
          where: { _id: '6576d6d44441e8ea8a38b5a8' },
          data: { role: 'ADMIN' },
        });
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
