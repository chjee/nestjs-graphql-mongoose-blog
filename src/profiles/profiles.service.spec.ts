import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ProfilesService } from './profiles.service';
import {
  profile,
  profiles,
  createProfileInput,
  updateProfileInput,
} from '../common/constants/jest.constants';
import { Profile } from './entities/profile.entity';

describe('ProfilesService', () => {
  let profilesService: ProfilesService;
  let profileModel: jest.Mock & Record<string, jest.Mock>;
  let save: jest.Mock;

  const queryChain = (result: unknown) => {
    const exec = jest.fn().mockResolvedValue(result);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });

    return { exec, limit, skip, sort };
  };

  beforeEach(async () => {
    save = jest.fn().mockResolvedValue(profile);
    profileModel = jest.fn().mockImplementation((data) => ({
      ...data,
      save,
    })) as jest.Mock & Record<string, jest.Mock>;
    profileModel.find = jest.fn();
    profileModel.findOne = jest.fn();
    profileModel.findOneAndUpdate = jest.fn();
    profileModel.findOneAndDelete = jest.fn();

    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        { provide: getModelToken(Profile.name), useValue: profileModel },
      ],
    }).compile();

    profilesService = moduleRef.get<ProfilesService>(ProfilesService);
  });

  it('creates a profile document', async () => {
    await expect(profilesService.create(createProfileInput)).resolves.toBe(
      profile,
    );
    expect(profileModel).toHaveBeenCalledWith(createProfileInput);
    expect(save).toHaveBeenCalledTimes(1);
  });

  it('finds profiles with bounded pagination defaults', async () => {
    const chain = queryChain(profiles);
    profileModel.find.mockReturnValue(chain);

    await expect(profilesService.findAll({})).resolves.toBe(profiles);

    expect(profileModel.find).toHaveBeenCalledWith({});
    expect(chain.sort).toHaveBeenCalledWith('-createdAt');
    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(10);
  });

  it('clamps pagination limits', async () => {
    const chain = queryChain(profiles);
    profileModel.find.mockReturnValue(chain);

    await profilesService.findAll({ skip: -1, limit: 0 });

    expect(chain.skip).toHaveBeenCalledWith(0);
    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it('finds one profile', async () => {
    const exec = jest.fn().mockResolvedValue(profile);
    profileModel.findOne.mockReturnValue({ exec });

    await expect(profilesService.findOne({ _id: profile.id })).resolves.toBe(
      profile,
    );
    expect(profileModel.findOne).toHaveBeenCalledWith({ _id: profile.id });
  });

  it('updates one profile', async () => {
    const exec = jest.fn().mockResolvedValue(profile);
    profileModel.findOneAndUpdate.mockReturnValue({ exec });

    await expect(
      profilesService.update({
        where: { _id: profile.id },
        data: updateProfileInput,
      }),
    ).resolves.toBe(profile);
    expect(profileModel.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: profile.id },
      { $set: updateProfileInput },
      { new: true },
    );
  });

  it('removes one profile', async () => {
    const exec = jest.fn().mockResolvedValue(profile);
    profileModel.findOneAndDelete.mockReturnValue({ exec });

    await expect(profilesService.remove({ _id: profile.id })).resolves.toBe(
      profile,
    );
    expect(profileModel.findOneAndDelete).toHaveBeenCalledWith({
      _id: profile.id,
    });
  });
});
