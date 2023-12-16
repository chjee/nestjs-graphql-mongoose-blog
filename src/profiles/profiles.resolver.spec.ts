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

describe('ProfilesResolver', () => {
  let profilesResolver: ProfilesResolver;
  let profilesService: ProfilesService;
  let usersService: UsersService;

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
      expect(await profilesResolver.createProfile(createProfileInput)).toBe(
        profile,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      jest
        .spyOn(profilesService, 'findAll')
        .mockImplementation(async () => profiles);
      expect(await profilesResolver.findAll(0, 5)).toBe(profiles);
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
      jest
        .spyOn(profilesService, 'update')
        .mockImplementation(async () => profile);
      expect(
        await profilesResolver.updateProfile(
          '6576d6d44441e8ea8a38b5a8',
          updateProfileInput,
        ),
      ).toBe(profile);
    });
  });

  describe('remove', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'remove')
        .mockImplementation(async () => profile);
      expect(
        await profilesResolver.removeProfile('6576d6d44441e8ea8a38b5a8'),
      ).toBe(profile);
    });
  });
});
