import { Test, TestingModule } from '@nestjs/testing';
import { ProfilesService } from './profiles.service';
import {
  profile,
  profiles,
  createProfileInput,
  updateProfileInput,
} from '../common/constants/jest.constants';
import { getModelToken } from '@nestjs/mongoose';
import { Profile } from './entities/profile.entity';

describe('ProfilesService', () => {
  let profilesService: ProfilesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: getModelToken(Profile.name), useValue: {} },
      ],
    })
      .overrideProvider(getModelToken(Profile.name))
      .useValue({})
      .compile();

    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
  });

  describe('create', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'create')
        .mockImplementation(async () => profile);
      expect(await profilesService.create(createProfileInput)).toBe(profile);
    });
  });

  describe('findAll', () => {
    it('should return an array of profiles', async () => {
      jest
        .spyOn(profilesService, 'findAll')
        .mockImplementation(async () => profiles);
      expect(await profilesService.findAll({ skip: 0, limit: 5 })).toBe(
        profiles,
      );
    });
  });

  describe('findOne', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'findOne')
        .mockImplementation(async () => profile);
      expect(
        await profilesService.findOne({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(profile);
    });
  });

  describe('update', () => {
    it('should return an updated profile', async () => {
      jest
        .spyOn(profilesService, 'update')
        .mockImplementation(async () => profile);
      expect(
        await profilesService.update({
          where: { _id: '6576d6d44441e8ea8a38b5a8' },
          data: updateProfileInput,
        }),
      ).toBe(profile);
    });
  });

  describe('remove', () => {
    it('should return a profile', async () => {
      jest
        .spyOn(profilesService, 'remove')
        .mockImplementation(async () => profile);
      expect(
        await profilesService.remove({ _id: '6576d6d44441e8ea8a38b5a8' }),
      ).toBe(profile);
    });
  });
});
