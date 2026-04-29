import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Query, Resolver } from '@nestjs/graphql';
import { createGraphqlTestApp } from './graphql-test-app';

@Resolver()
class HealthResolver {
  @Query(() => String)
  health(): string {
    return 'ok';
  }
}

describe('GraphQL app (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createGraphqlTestApp([HealthResolver]);
  });

  it('serves GraphQL requests without the production MongoDB module', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ health }' })
      .expect(200)
      .expect({ data: { health: 'ok' } });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
