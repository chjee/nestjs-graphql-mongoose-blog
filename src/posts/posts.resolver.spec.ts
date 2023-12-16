import { Test, TestingModule } from '@nestjs/testing';
import { PostsResolver } from './posts.resolver';
import { PostsService } from './posts.service';
import {
  post,
  posts,
  createPostInput,
  updatePostInput,
  categories,
  user,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { CategoriesService } from './../categories/categories.service';
import { Category } from './../categories/entities/category.entity';
import { ConfigService } from '@nestjs/config';

describe('PostsResolver', () => {
  let postsResolver: PostsResolver;
  let postsService: PostsService;
  let categoriesService: CategoriesService;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Post.name), useValue: {} },
        { provide: getModelToken(Category.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        PostsResolver,
        PostsService,
        CategoriesService,
        UsersService,
        ConfigService,
      ],
    })
      .overrideProvider(getModelToken(Post.name))
      .useValue({})
      .overrideProvider(getModelToken(Category.name))
      .useValue({})
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    postsResolver = moduleRef.get<PostsResolver>(PostsResolver);
    postsService = moduleRef.get<PostsService>(PostsService);
    categoriesService = moduleRef.get<CategoriesService>(CategoriesService);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'create').mockImplementation(async () => post);
      expect(await postsResolver.createPost(createPostInput)).toBe(post);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postsService, 'findAll').mockImplementation(async () => posts);
      expect(await postsResolver.findAll(0, 5)).toBe(posts);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'findOne').mockImplementation(async () => post);
      expect(await postsResolver.findOne('6576d6d44441e8ea8a38b5a8')).toBe(
        post,
      );
    });
  });

  describe('categories', () => {
    it('should return an array of categories', async () => {
      jest
        .spyOn(categoriesService, 'findAll')
        .mockImplementation(async () => categories);
      expect(await postsResolver.categories(post)).toBe(categories);
    });
  });

  describe('user', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => user);
      expect(await postsResolver.user(post)).toBe(user);
    });
  });

  describe('update', () => {
    it('should return an updated post', async () => {
      jest.spyOn(postsService, 'update').mockImplementation(async () => post);
      expect(
        await postsResolver.updatePost(
          '6576d6d44441e8ea8a38b5a8',
          updatePostInput,
        ),
      ).toBe(post);
    });
  });

  describe('remove', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'remove').mockImplementation(async () => post);
      expect(await postsResolver.removePost('6576d6d44441e8ea8a38b5a8')).toBe(
        post,
      );
    });
  });
});
