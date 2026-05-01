import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesResolver } from './profiles.resolver';
import { ProfilesService } from './profiles.service';
import {
  profile,
  profiles,
  createProfileInput,
  updateProfileInput,
  user,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';
import { User } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { ForbiddenException } from '@nestjs/common';

describe('ProfilesResolver', () => {
  let profilesResolver: ProfilesResolver;
  let profilesService: ProfilesService;
  let usersService: UsersService;
  const authUser = {
    userId: user.id,
    name: user.name,
    role: 'USER',
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: getModelToken(Profile.name), useValue: {} },
        { provide: getModelToken(User.name), useValue: {} },
        ProfilesResolver,
        ProfilesService,
        UsersService,
        ConfigService,
      ],
    })
      .overrideProvider(getModelToken(Profile.name))
      .useValue({})
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    profilesResolver = moduleRef.get<ProfilesResolver>(ProfilesResolver);
    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('create', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'create')
        .mockImplementation(async () => profile);
      expect(
        await profilesResolver.createProfile(authUser, createProfileInput),
      ).toBe(profile);
    });
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      jest
        .spyOn(profilesService, 'findAll')
        .mockImplementation(async () => profiles);
      expect(await profilesResolver.findAll({ skip: 0, limit: 5 })).toBe(
        profiles,
      );
    });
  });

  describe('findOne', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'findOne')
        .mockImplementation(async () => profile);
      expect(await profilesResolver.findOne('6576d6d44441e8ea8a38b5a8')).toBe(
        profile,
      );
    });
  });

  describe('user', () => {
    it('should return a user', async () => {
      jest.spyOn(usersService, 'findOne').mockImplementation(async () => user);
      expect(await profilesResolver.user(profile)).toBe(user);
    });
  });

  describe('update', () => {
    it('should return an updated profile', async () => {
      jest.spyOn(profilesService, 'findOne').mockImplementation(async () => ({
        ...profile,
        userId: new Types.ObjectId(authUser.userId) as unknown as string,
      }));
      jest
        .spyOn(profilesService, 'update')
        .mockImplementation(async () => profile);
      expect(
        await profilesResolver.updateProfile(
          authUser,
          '6576d6d44441e8ea8a38b5a8',
          updateProfileInput,
        ),
      ).toBe(profile);
    });

    it('should reject updates from a different user', async () => {
      jest
        .spyOn(profilesService, 'findOne')
        .mockImplementation(async () => profile);
      jest
        .spyOn(profilesService, 'update')
        .mockImplementation(async () => profile);

      await expect(
        profilesResolver.updateProfile(
          { ...authUser, userId: '6576d6d44441e8ea8a38b5a9' },
          '6576d6d44441e8ea8a38b5a8',
          updateProfileInput,
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(profilesService.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should return a profile', async () => {
      jest.spyOn(profilesService, 'findOne').mockImplementation(async () => ({
        ...profile,
        userId: new Types.ObjectId(authUser.userId) as unknown as string,
      }));
      jest
        .spyOn(profilesService, 'remove')
        .mockImplementation(async () => profile);
      expect(
        await profilesResolver.removeProfile(
          authUser,
          '6576d6d44441e8ea8a38b5a8',
        ),
      ).toBe(profile);
    });

    it('should reject removals from a different user', async () => {
      jest
        .spyOn(profilesService, 'findOne')
        .mockImplementation(async () => profile);
      jest
        .spyOn(profilesService, 'remove')
        .mockImplementation(async () => profile);

      await expect(
        profilesResolver.removeProfile(
          { ...authUser, userId: '6576d6d44441e8ea8a38b5a9' },
          '6576d6d44441e8ea8a38b5a8',
        ),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(profilesService.remove).not.toHaveBeenCalled();
    });
  });
});
