import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersService } from '../src/users/users.service';
import { createGraphqlTestApp } from './graphql-test-app';
import { UsersResolver } from '../src/users/users.resolver';
import { PostsService } from '../src/posts/posts.service';
import { ProfilesService } from '../src/profiles/profiles.service';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { TestJwtAuthGuard } from './test-jwt-auth.guard';

describe('UsersResolver (e2e)', () => {
  let app: INestApplication;
  const usersService = {
    create: () => mockUser,
    findAll: () => [mockUser, mockUser],
    findOne: () => mockUser,
    update: () => mockUser,
    remove: () => mockUser,
  };
  const postsService = {
    findAll: () => [],
  };
  const profilesService = {
    findOne: () => null,
  };

  const mockUser = {
    id: '6576d6d44441e8ea8a38b5a8',
    name: 'Alice',
    email: 'alice@prisma.io',
    role: 'USER',
  };

  beforeAll(async () => {
    app = await createGraphqlTestApp([
      UsersResolver,
      RolesGuard,
      { provide: UsersService, useValue: usersService },
      { provide: PostsService, useValue: postsService },
      { provide: ProfilesService, useValue: profilesService },
      { provide: APP_GUARD, useClass: TestJwtAuthGuard },
      { provide: APP_GUARD, useExisting: RolesGuard },
    ]);
  });

  it('createUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            createUser(createUserInput: {
              email: "andrew@prisma.io"
              name: "Andrew"
              password: "whoami"
            })
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { createUser: usersService.create() } });
  });

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getUsers(skip:0, limit:5)
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getUsers: usersService.findAll() } });
  });

  it('rejects invalid pagination', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getUsers(skip: -1, limit: 101)
            {
              id
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toBeNull();
        expect(body.errors?.[0]?.message).toBe('Bad Request Exception');
      });
  });

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getUserById(id: "6576d6d44441e8ea8a38b5a8")
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getUserById: usersService.findOne() } });
  });

  it('rejects invalid ObjectId arguments', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getUserById(id: "not-a-valid-object-id")
            {
              id
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual({ getUserById: null });
        expect(body.errors?.[0]?.message).toBe('Invalid ObjectId');
      });
  });

  it('updateUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            updateUser(id: "6576d6d44441e8ea8a38b5a8", 
            updateUserInput: {
              name: "Andy"
            })
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { updateUser: usersService.update() } });
  });

  it('updateUserRole', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            updateUserRole(id: "6576d6d44441e8ea8a38b5a8",
            updateUserRoleInput: {
              role: "USER"
            })
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { updateUserRole: usersService.update() } });
  });

  it('removeUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            removeUser(id: "6576d6d44441e8ea8a38b5a8")
            {
              id
              name
              email
              role
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { removeUser: usersService.remove() } });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
