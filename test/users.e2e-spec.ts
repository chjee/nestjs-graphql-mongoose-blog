import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { UsersService } from '../src/users/users.service';
import { createGraphqlTestApp } from './graphql-test-app';
import { UsersResolver } from '../src/users/users.resolver';
import { PostsService } from '../src/posts/posts.service';
import { ProfilesService } from '../src/profiles/profiles.service';

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
      { provide: UsersService, useValue: usersService },
      { provide: PostsService, useValue: postsService },
      { provide: ProfilesService, useValue: profilesService },
    ]);
  });

  it('createUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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

  it('updateUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            updateUser(id: "6576d6d44441e8ea8a38b5a8", 
            updateUserInput: {
              name: "Andy",
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
      .expect({ data: { updateUser: usersService.update() } });
  });

  it('removeUser', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
