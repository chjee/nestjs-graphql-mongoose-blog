import {
  Resolver,
  Query,
  Mutation,
  Args,
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
import { PaginationArgs } from './../common/dto/pagination.args';
import { User as CurrentUser } from './../common/decorators/user.decorator';
import { AuthenticatedUser } from './../common/interfaces/authenticated-user.interface';
import { assertCanAccessUser } from './../common/utils/authorization.util';
import { ObjectIdPipe } from './../common/pipes/object-id.pipe';

@Resolver(() => Profile)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Profile)
  async createProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('createProfileInput') createProfileInput: CreateProfileInput,
  ): Promise<Profile> {
    assertCanAccessUser(user, createProfileInput.userId);

    return this.profilesService.create(createProfileInput);
  }

  @Query(() => [Profile], { name: 'getProfiles' })
  async findAll(@Args() { skip, limit }: PaginationArgs): Promise<Profile[]> {
    return this.profilesService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Profile, { nullable: true, name: 'getProfileById' })
  async findOne(
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<Profile | null> {
    return this.profilesService.findOne({ _id: id });
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() { userId }: Profile): Promise<User | null> {
    return this.usersService.findOne({ _id: userId });
  }

  @Mutation(() => Profile, { nullable: true, name: 'updateProfile' })
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
  ): Promise<any> {
    const profile = await this.profilesService.findOne({ _id: id });

    if (!profile) {
      return null;
    }

    assertCanAccessUser(user, profile.userId);

    return this.profilesService.update({
      where: { _id: id },
      data: updateProfileInput,
    });
  }

  @Mutation(() => Profile, { nullable: true, name: 'removeProfile' })
  async removeProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<any> {
    const profile = await this.profilesService.findOne({ _id: id });

    if (!profile) {
      return null;
    }

    assertCanAccessUser(user, profile.userId);

    return this.profilesService.remove({ _id: id });
  }
}
