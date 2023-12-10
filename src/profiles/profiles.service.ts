import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(Profile.name) private profiles: Model<Profile>) {}
  private readonly logger = new Logger(ProfilesService.name);

  async create(createProfileInput: CreateProfileInput): Promise<Profile> {
    const user = new this.profiles(createProfileInput);
    return user.save();
  }

  async findAll(params: { skip?: number; limit?: number }): Promise<Profile[]> {
    const { skip, limit } = params;
    const count = await this.profiles.countDocuments().exec();

    if (count <= 0) {
      this.logger.error('No profiles found');
      throw new NotFoundException('No profiles found');
    }

    const profiles = await this.profiles
      .find()
      .sort('-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return profiles;
  }

  async findOne(id: string): Promise<Profile> {
    const profile = await this.profiles.findById({ _id: id }).exec();

    if (!profile) {
      this.logger.error(`Profile with id ${id} not found`);
      throw new NotFoundException(`Profile with id ${id} not found`);
    }
    return profile;
  }

  async update(
    id: string,
    updateProfileInput: UpdateProfileInput,
  ): Promise<any> {
    return this.profiles
      .findByIdAndUpdate(
        { _id: id },
        { $set: updateProfileInput },
        { new: true },
      )
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.profiles.findByIdAndUpdate({ _id: id }).exec();
  }
}
