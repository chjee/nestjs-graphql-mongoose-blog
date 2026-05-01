import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ProfilesService } from '../src/profiles/profiles.service';
import { createGraphqlTestApp } from './graphql-test-app';
import { ProfilesResolver } from '../src/profiles/profiles.resolver';
import { UsersService } from '../src/users/users.service';
import { TestJwtAuthGuard } from './test-jwt-auth.guard';
import { Types } from 'mongoose';

describe('ProfilesResolver (e2e)', () => {
  let app: INestApplication;
  const profilesService = {
    create: () => mockProfile,
    findAll: () => [mockProfile],
    findOne: () => mockProfile,
    update: () => mockProfile,
    remove: () => mockProfile,
  };
  const usersService = {
    findOne: () => null,
  };

  const mockProfile = {
    id: '6576d6d44441e8ea8a38b5a8',
    bio: 'Happy',
    userId: new Types.ObjectId('6576d6d44441e8ea8a38b5a8'),
  };
  const expectedProfile = {
    ...mockProfile,
    userId: '6576d6d44441e8ea8a38b5a8',
  };

  beforeAll(async () => {
    app = await createGraphqlTestApp([
      ProfilesResolver,
      { provide: ProfilesService, useValue: profilesService },
      { provide: UsersService, useValue: usersService },
      { provide: APP_GUARD, useClass: TestJwtAuthGuard },
    ]);
  });

  it('createProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER:6576ebe3c9d91d197cab7513')
      .send({
        query: `
          mutation {
            createProfile(
              createProfileInput: {
                bio: "Happy"
                userId: "6576ebe3c9d91d197cab7513"
            })
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { createProfile: expectedProfile } });
  });

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          query {
            getProfiles(skip:0, limit:5)
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getProfiles: [expectedProfile] } });
  });

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          query {
            getProfileById(id: "6576ebe3c9d91d197cab7513")
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getProfileById: expectedProfile } });
  });

  it('updateProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          mutation {
            updateProfile(id: "6576ebe3c9d91d197cab7513",
              updateProfileInput: {
                bio: "Soso"
            })
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({
        data: {
          updateProfile: expectedProfile,
        },
      });
  });

  it('rejects updateProfile for a different USER token', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER:6576d6d44441e8ea8a38b5a9')
      .send({
        query: `
          mutation {
            updateProfile(id: "6576ebe3c9d91d197cab7513", 
              updateProfileInput: {
                bio: "Soso"
            })
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual({ updateProfile: null });
        expect(body.errors?.[0]?.message).toBe('Forbidden');
      });
  });

  it('removeProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          mutation {
            removeProfile(id: "6576ebe3c9d91d197cab7513")
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({
        data: {
          removeProfile: expectedProfile,
        },
      });
  });

  it('rejects removeProfile for a different USER token', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER:6576d6d44441e8ea8a38b5a9')
      .send({
        query: `
          mutation {
            removeProfile(id: "6576ebe3c9d91d197cab7513")
            {
              id
              bio
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toEqual({ removeProfile: null });
        expect(body.errors?.[0]?.message).toBe('Forbidden');
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
