import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Mutation(() => Profile)
  async createProfile(
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ): Promise<Profile> {
    return this.profilesService.create(createProfileInput);
  }

  @Query(() => [Profile], { name: 'getProfiles' })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Profile[]> {
    return this.profilesService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Profile, { name: 'getProfileById' })
  async findOne(
    @Args('id', { type: () => String }) id: string,
  ): Promise<Profile> {
    return this.profilesService.findOne(id);
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args('id', { type: () => String }) id: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ): Promise<any> {
    return this.profilesService.update(id, updateProfileInput);
  }

  @Mutation(() => Profile)
  async removeProfile(
    @Args('id', { type: () => String }) id: string,
  ): Promise<any> {
    return this.profilesService.remove(id);
  }
}
