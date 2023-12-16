import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { ProfilesService } from '../src/profiles/profiles.service';

describe('ProfilesResolver (e2e)', () => {
  let app: INestApplication;
  const profilesService = {
    create: () => mockProfile,
    findAll: () => [mockProfile],
    findOne: () => mockProfile,
    update: () => mockProfile,
    remove: () => mockProfile,
  };

  const mockProfile = {
    id: '6576d6d44441e8ea8a38b5a8',
    bio: 'Happy',
    userId: '6576d6d44441e8ea8a38b5a8',
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(ProfilesService)
      .useValue(profilesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('createProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
      .expect({ data: { createProfile: profilesService.create() } });
  });

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
      .expect({ data: { getProfiles: profilesService.findAll() } });
  });

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
      .expect({ data: { getProfileById: profilesService.findOne() } });
  });

  it('updateProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
      .expect({ data: { updateProfile: profilesService.update() } });
  });

  it('removeProfile', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
      .expect({ data: { removeProfile: profilesService.remove() } });
  });

  afterAll(async () => {
    await app.close();
  });
});
