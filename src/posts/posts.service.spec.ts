import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import {
  post,
  posts,
  createPostInput,
  updatePostInput,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';

describe('PostsService', () => {
  let postsService: PostsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: {} },
      ],
    })
      .overrideProvider(getModelToken(Post.name))
      .useValue({})
      .compile();

    postsService = moduleRef.get<PostsService>(PostsService);
  });

  describe('create', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'create').mockImplementation(async () => post);
      expect(await postsService.create(createPostInput)).toBe(post);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postsService, 'findAll').mockImplementation(async () => posts);
      expect(await postsService.findAll({ skip: 0, limit: 5 })).toBe(posts);
    });
  });

  describe('findOne', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'findOne').mockImplementation(async () => post);
      expect(
        await postsService.findOne({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(post);
    });
  });

  describe('update', () => {
    it('should return an updated post', async () => {
      jest.spyOn(postsService, 'update').mockImplementation(async () => post);
      expect(
        await postsService.update({
          where: { _id: '6576d6d44441e8ea8a38b5a8' },
          data: updatePostInput,
        }),
      ).toBe(post);
    });
  });

  describe('remove', () => {
    it('should return a post', async () => {
      jest.spyOn(postsService, 'remove').mockImplementation(async () => post);
      expect(
        await postsService.remove({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(post);
    });
  });
});
