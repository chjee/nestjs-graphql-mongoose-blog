import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import {
  post,
  posts,
  createPostInput,
  updatePostInput,
} from '../common/constants/jest.constants';
import { Post } from './entities/post.entity';

describe('PostsService', () => {
  let postsService: PostsService;
  let postModel: jest.Mock & Record<string, jest.Mock>;
  let save: jest.Mock;

  const queryChain = (result: unknown) => {
    const exec = jest.fn().mockResolvedValue(result);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    return { exec, limit, skip, sort };
  };

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue(post);
    postModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save,
    })) as jest.Mock & Record<string, jest.Mock>;
    postModel.find = jest.fn();
    postModel.findOne = jest.fn();
    postModel.findOneAndUpdate = jest.fn();
    postModel.findOneAndDelete = jest.fn();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getModelToken(Post.name), useValue: postModel },
      ],
    }).compile();

    postsService = moduleRef.get<PostsService>(PostsService);
  });

  it('creates a post document', async () => {
    await expect(postsService.create(createPostInput)).resolves.toBe(post);
    expect(postModel).toHaveBeenCalledWith(createPostInput);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('finds posts with bounded pagination defaults', async () => {
    const chain = queryChain(posts);
    postModel.find.mockReturnValue(chain);

    await expect(postsService.findAll({})).resolves.toBe(posts);

    expect(postModel.find).toHaveBeenCalledWith({});
    expect(chain.sort).toHaveBeenCalledWith('-createdAt');
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it('applies filters and ordering', async () => {
    const chain = queryChain(posts);
    postModel.find.mockReturnValue(chain);

    await postsService.findAll({
      where: { userId: post.userId },
      orderBy: 'title',
      skip: 2,
      limit: 5,
    });

    expect(postModel.find).toHaveBeenCalledWith({ userId: post.userId });
    expect(chain.sort).toHaveBeenCalledWith('title');
    expect(chain.skip).toHaveBeenCalledWith(2);
    expect(chain.limit).toHaveBeenCalledWith(5);
  });

  it('finds one post', async () => {
    const exec = jest.fn().mockResolvedValue(post);
    postModel.findOne.mockReturnValue({ exec });

    await expect(postsService.findOne({ _id: post.id })).resolves.toBe(post);
    expect(postModel.findOne).toHaveBeenCalledWith({ _id: post.id });
  });

  it('updates one post', async () => {
    const exec = jest.fn().mockResolvedValue(post);
    postModel.findOneAndUpdate.mockReturnValue({ exec });

    await expect(
      postsService.update({
        where: { _id: post.id },
        data: updatePostInput,
      }),
    ).resolves.toBe(post);
    expect(postModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: post.id },
      { $set: updatePostInput },
      { new: true },
    );
  });

  it('removes one post', async () => {
    const exec = jest.fn().mockResolvedValue(post);
    postModel.findOneAndDelete.mockReturnValue({ exec });

    await expect(postsService.remove({ _id: post.id })).resolves.toBe(post);
    expect(postModel.findOneAndDelete).toHaveBeenCalledWith({ _id: post.id });
  });
});
