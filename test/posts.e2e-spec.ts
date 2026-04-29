import * as request from 'supertest';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { PostsService } from '../src/posts/posts.service';
import { createGraphqlTestApp } from './graphql-test-app';
import { PostsResolver } from '../src/posts/posts.resolver';
import { UsersService } from '../src/users/users.service';
import { CategoriesService } from '../src/categories/categories.service';

describe('PostsResolver (e2e)', () => {
  let app: INestApplication;
  const postsService = {
    create: () => mockPost,
    findAll: () => [mockPost, mockPost],
    findOne: () => mockPost,
    update: () => mockPost,
    remove: () => mockPost,
  };
  const usersService = {
    findOne: () => null,
  };
  const categoriesService = {
    findAll: () => [],
  };

  const mockPost = {
    id: '6576d6d44441e8ea8a38b5a8',
    title: 'Check out Prisma with Nest.js',
    published: false,
    userId: '6576d6d44441e8ea8a38b5a8',
  };

  beforeAll(async () => {
    app = await createGraphqlTestApp([
      PostsResolver,
      { provide: PostsService, useValue: postsService },
      { provide: UsersService, useValue: usersService },
      { provide: CategoriesService, useValue: categoriesService },
    ]);
  });

  it('createPost', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createPost(
              createPostInput: {
                title: "Just 5 minutes."
                published: false
                userId: "6576d6d44441e8ea8a38b5a8"
            })
            {
              id
              title
              published
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { createPost: postsService.create() } });
  });

  it('findAll', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            getPosts(skip: 0, limit: 5) {
              id
              title
              published
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getPosts: postsService.findAll() } });
  });

  it('findOne', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            getPostById(id: "6576d6d44441e8ea8a38b5a8") {
              id
              title
              published
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { getPostById: postsService.findOne() } });
  });

  it('updatePost', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            updatePost(
              id: "6576d6d44441e8ea8a38b5a8",
              updatePostInput: {
                title: "Just 10 minutes.",
                published: true }) {
              id
              title
              published
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { updatePost: postsService.update() } });
  });

  it('removePost', async () => {
    return await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            removePost(id: "6576d6d44441e8ea8a38b5a8")
            {
              id
              title
              published
              userId
            }
          }
        `,
      })
      .expect(HttpStatus.OK)
      .expect({ data: { removePost: postsService.remove() } });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
