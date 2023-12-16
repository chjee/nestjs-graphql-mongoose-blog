import { Test, TestingModule } from '@nestjs/testing';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import {
  user,
  users,
  createUserInput,
  updateUserInput,
  posts,
  profile,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './../users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { PostsService } from './../posts/posts.service';
import { Post } from './../posts/entities/post.entity';
import { ProfilesService } from './../profiles/profiles.service';
import { Profile } from './../profiles/entities/profile.entity';

describe('UsersResolver', () => {
  let usersResolver: UsersResolver;
  let usersService: UsersService;
  let postsService: PostsService;
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(User.name), useValue: {} },
        { provide: getModelToken(Post.name), useValue: {} },
        { provide: getModelToken(Profile.name), useValue: {} },
        UsersResolver,
        UsersService,
        ConfigService,
        PostsService,
        ProfilesService,
      ],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .overrideProvider(getModelToken(Post.name))
      .useValue({})
      .overrideProvider(getModelToken(Profile.name))
      .useValue({})
      .compile();

    usersResolver = moduleRef.get<UsersResolver>(UsersResolver);
    usersService = moduleRef.get<UsersService>(UsersService);
    postsService = moduleRef.get<PostsService>(PostsService);
    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
  });

  describe('create', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'create').mockImplementation(async () => user);
      expect(await usersResolver.createUser(createUserInput)).toBe(user);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      jest.spyOn(usersService, 'findAll').mockImplementation(async () => users);
      expect(await usersResolver.findAll(0, 5)).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => user);
      expect(await usersResolver.findOne('6576d6d44441e8ea8a38b5a8')).toBe(
        user,
      );
    });
  });

  describe('posts', () => {
    it('should return an array of posts', async () => {
      jest.spyOn(postsService, 'findAll').mockImplementation(async () => posts);
      expect(await usersResolver.posts(user)).toBe(posts);
    });
  });

  describe('profile', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'findOne')
        .mockImplementation(async () => profile);
      expect(await usersResolver.profile(user)).toBe(profile);
    });
  });

  describe('update', () => {
    it('should return an updated user', async () => {
      jest.spyOn(usersService, 'update').mockImplementation(async () => user);
      expect(
        await usersResolver.updateUser(
          '6576d6d44441e8ea8a38b5a8',
          updateUserInput,
        ),
      ).toBe(user);
    });
  });

  describe('remove', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'remove').mockImplementation(async () => user);
      expect(await usersResolver.removeUser('6576d6d44441e8ea8a38b5a8')).toBe(
        user,
      );
    });
  });
});
