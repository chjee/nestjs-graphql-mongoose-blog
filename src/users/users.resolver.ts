import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UpdateUserRoleInput } from './dto/update-user-role.input';
import { PostsService } from './../posts/posts.service';
import { Post } from './../posts/entities/post.entity';
import { ProfilesService } from './../profiles/profiles.service';
import { Profile } from './../profiles/entities/profile.entity';
import { Public } from './../common/decorators/public.decorator';
import { PaginationArgs } from './../common/dto/pagination.args';
import { Roles } from './../common/decorators/roles.decorator';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Mutation(() => User)
  @Public()
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getUsers' })
  async findAll(@Args() { skip, limit }: PaginationArgs): Promise<User[]> {
    return this.usersService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => User, { nullable: true, name: 'getUserById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return this.usersService.findOne({ _id: id });
  }

  @ResolveField(() => [Post], { nullable: true })
  async posts(@Parent() { id }: User): Promise<Post[] | null> {
    return this.postsService.findAll({
      where: { userId: id },
    });
  }

  @ResolveField(() => Profile, { nullable: true })
  async profile(@Parent() { id }: User): Promise<Profile | null> {
    return this.profilesService.findOne({ userId: id });
  }

  @Mutation(() => User, { nullable: true, name: 'updateUser' })
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<any> {
    return this.usersService.update({
      where: { _id: id },
      data: updateUserInput,
    });
  }

  @Roles('ADMIN')
  @Mutation(() => User, { nullable: true, name: 'updateUserRole' })
  async updateUserRole(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput,
  ): Promise<any> {
    return this.usersService.update({
      where: { _id: id },
      data: updateUserRoleInput,
    });
  }

  @Mutation(() => User, { nullable: true, name: 'removeUser' })
  async removeUser(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.usersService.remove({ _id: id });
  }
}
