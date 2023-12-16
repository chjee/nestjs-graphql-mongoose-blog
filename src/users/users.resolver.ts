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
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { PostsService } from './../posts/posts.service';
import { Post } from './../posts/entities/post.entity';
import { ProfilesService } from './../profiles/profiles.service';
import { Profile } from './../profiles/entities/profile.entity';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Mutation(() => User)
  async createUser(
    @Args('createUserInput') createUserInput: CreateUserInput,
  ): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Query(() => [User], { name: 'getUsers' })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<User[]> {
    return this.usersService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => User, { name: 'getUserById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<User | null> {
    return this.usersService.findOne({ _id: id });
  }

  @ResolveField(() => User)
  async posts(@Parent() { id }: User): Promise<Post[] | null> {
    return this.postsService.findAll({
      where: { userId: id },
    });
  }

  @ResolveField(() => User)
  async profile(@Parent() { id }: User): Promise<Profile | null> {
    return this.profilesService.findOne({ userId: id });
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
  ): Promise<any> {
    return this.usersService.update({
      where: { _id: id },
      data: updateUserInput,
    });
  }

  @Mutation(() => User)
  async removeUser(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.usersService.remove({ _id: id });
  }
}
