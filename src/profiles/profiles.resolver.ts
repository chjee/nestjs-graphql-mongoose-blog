import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from './entities/profile.entity';
import { CreateProfileInput } from './dto/create-profile.input';
import { UpdateProfileInput } from './dto/update-profile.input';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

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
  ): Promise<Profile[] | null> {
    return this.profilesService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Profile, { name: 'getProfileById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Profile | null> {
    return this.profilesService.findOne({ _id: id });
  }

  @ResolveField(() => Profile)
  async user(@Parent() { userId }: Profile): Promise<User | null> {
    return this.usersService.findOne({ _id: userId });
  }

  @Mutation(() => Profile)
  async updateProfile(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ): Promise<any> {
    return this.profilesService.update({
      where: { _id: id },
      data: updateProfileInput,
    });
  }

  @Mutation(() => Profile)
  async removeProfile(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<any> {
    return this.profilesService.remove({ _id: id });
  }
}
