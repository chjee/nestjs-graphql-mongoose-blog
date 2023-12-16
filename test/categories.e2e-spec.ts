import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { CategoriesService } from '../src/categories/categories.service';

describe('CategorysResolver (e2e)', () => {
  let app: INestApplication;
  const categoriesService = {
    create: () => mockCategory,
    findAll: () => [mockCategory],
    findOne: () => mockCategory,
    update: () => mockCategory,
    remove: () => mockCategory,
  };

  const mockCategory = {
    id: '6576d6d44441e8ea8a38b5a8',
    name: 'Science',
    // createdAt: new Date(),
    // updatedAt: new Date(),
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(CategoriesService)
      .useValue(categoriesService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('createCategory', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
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
    await app.close();
  });
});
