import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { UsersService } from '../src/users/users.service';

describe('UsersResolver (e2e)', () => {
  let app: INestApplication;
  const usersService = {
    create: () => mockUser,
    findAll: () => [mockUser, mockUser],
    findOne: () => mockUser,
    update: () => mockUser,
    remove: () => mockUser,
  };

  const mockUser = {
    id: '6576d6d44441e8ea8a38b5a8',
    name: 'Alice',
    email: 'alice@prisma.io',
    role: 'USER',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
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
              role: "ADMIN"
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
    await app.close();
  });
});
