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
import { CategoriesService } from './../categories/categories.service';
import { Category } from './../categories/entities/category.entity';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
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

  @Query(() => Post, { nullable: true, name: 'getPostById' })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Post | null> {
    return this.postsService.findOne({ _id: id });
  }

  @ResolveField(() => Post)
  async user(@Parent() { userId }: Post): Promise<User | null> {
    return this.usersService.findOne({ _id: userId });
  }

  @ResolveField(() => Post)
  async categories(@Parent() { categoryIds }: Post): Promise<Category[]> {
    return this.categoriesService.findAll({
      where: { _id: { $in: categoryIds } },
    });
  }

  @Mutation(() => Post, { nullable: true, name: 'updatePost' })
  async updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<any> {
    return this.postsService.update({
      where: { _id: id },
      data: updatePostInput,
    });
  }

  @Mutation(() => Post, { nullable: true, name: 'removePost' })
  async removePost(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.postsService.remove({ _id: id });
  }
}
