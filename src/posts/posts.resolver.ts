import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { UsersService } from './../users/users.service';
import { User } from './../users/entities/user.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
  ) {}

  @Mutation(() => Post)
  async createPost(
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    return this.postsService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'getPosts' })
  async findAll(
    @Args('skip', { type: () => Int, nullable: true }) skip?: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ): Promise<Post[]> {
    return this.postsService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Post, { name: 'getPostById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Post | null> {
    return this.postsService.findOne({ _id: id });
  }

  @ResolveField(() => Post)
  async user(@Parent() { userId }: Post): Promise<User | null> {
    return this.usersService.findOne({ _id: userId });
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<any> {
    return this.postsService.update({
      where: { _id: id },
      data: updatePostInput,
    });
  }

  @Mutation(() => Post)
  async removePost(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.postsService.remove({ _id: id });
  }
}
