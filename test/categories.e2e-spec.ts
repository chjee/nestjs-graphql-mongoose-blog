import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { CategoriesService } from '../src/categories/categories.service';
import { createGraphqlTestApp } from './graphql-test-app';
import { CategoriesResolver } from '../src/categories/categories.resolver';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { TestJwtAuthGuard } from './test-jwt-auth.guard';

describe('CategorysResolver (e2e)', () => {
  let app: INestApplication;
  const categoriesService = {
    create: jest.fn(() => mockCategory),
    findAll: jest.fn(() => [mockCategory]),
    findOne: jest.fn(() => mockCategory),
    update: jest.fn(() => mockCategory),
    remove: jest.fn(() => mockCategory),
  };

  const mockCategory = {
    id: '6576d6d44441e8ea8a38b5a8',
    name: 'Science',
    // createdAt: new Date(),
    // updatedAt: new Date(),
  };

  beforeAll(async () => {
    app = await createGraphqlTestApp([
      CategoriesResolver,
      RolesGuard,
      { provide: CategoriesService, useValue: categoriesService },
      { provide: APP_GUARD, useClass: TestJwtAuthGuard },
      { provide: APP_GUARD, useExisting: RolesGuard },
    ]);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createCategory', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            createCategory(
              createCategoryInput: {
                name: "Science"
            })
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { createCategory: categoriesService.create() } });
  });

  it('rejects createCategory for USER role tokens', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer USER')
      .send({
        query: `
          mutation {
            createCategory(
              createCategoryInput: {
                name: "Science"
            })
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect(({ body }) => {
        expect(body.data).toBeNull();
        expect(body.errors?.[0]?.message).toBe('Forbidden resource');
        expect(categoriesService.create).not.toHaveBeenCalled();
      });
  });

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getCategories(skip:0, limit:5)
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getCategories: categoriesService.findAll() } });
  });

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          query {
            getCategoryById(id: "6576ebe3c9d91d197cab7513")
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getCategoryById: categoriesService.findOne() } });
  });

  it('updateCategory', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            updateCategory(id: "6576ebe3c9d91d197cab7513", 
              updateCategoryInput: {
                name: "Database"
            })
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { updateCategory: categoriesService.update() } });
  });

  it('removeCategory', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', 'Bearer ADMIN')
      .send({
        query: `
          mutation {
            removeCategory(id: "6576ebe3c9d91d197cab7513")
            {
              id
              name
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { removeCategory: categoriesService.remove() } });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
