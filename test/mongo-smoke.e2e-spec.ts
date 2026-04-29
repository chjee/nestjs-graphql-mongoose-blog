import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

const runMongoSmoke =
  process.env.RUN_MONGO_SMOKE === 'true' || process.env.RUN_MONGO_SMOKE === '1';
const describeMongoSmoke = runMongoSmoke ? describe : describe.skip;

describeMongoSmoke('Mongo-backed AppModule smoke (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is required for npm run test:e2e:mongo');
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is required for npm run test:e2e:mongo');
    }

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('starts AppModule and serves GraphQL through the real Mongo connection', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            login(signInInput: {
              email: "mongo-smoke@example.com"
              password: "not-a-real-password"
            }) {
              token
            }
          }
        `,
      })
      .expect(200)
      .expect(({ body }) => {
        expect(body.data).toBeNull();
        expect(body.errors?.[0]?.message).toBe('Unauthorized');
      });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
