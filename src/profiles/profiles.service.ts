import { Injectable } from '@nestjs/common';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(@InjectModel(Profile.name) private profiles: Model<Profile>) {}
  async create(createProfileInput: CreateProfileInput): Promise<Profile> {
    const user = new this.profiles(createProfileInput);
    return user.save();
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: object;
    orderBy?: string;
  }): Promise<Profile[]> {
    const { skip, limit, where, orderBy } = params;

    const profiles = await this.profiles
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(Math.max(skip ?? 0, 0))
      .limit(Math.min(Math.max(limit ?? 10, 1), 100))
      .exec();

    return profiles;
  }

  async findOne(where: object): Promise<Profile | null> {
    return this.profiles.findOne(where).exec();
  }

  async update(params: {
    where: object;
    data: UpdateProfileInput;
  }): Promise<any> {
    const { where, data } = params;
    return this.profiles
      .findOneAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.profiles.findOneAndDelete(where).exec();
  }
}
