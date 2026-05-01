import {
  Resolver,
  Query,
  Mutation,
  Args,
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
import { PaginationArgs } from './../common/dto/pagination.args';
import { User as CurrentUser } from './../common/decorators/user.decorator';
import { AuthenticatedUser } from './../common/interfaces/authenticated-user.interface';
import { assertCanAccessUser } from './../common/utils/authorization.util';
import { ObjectIdPipe } from './../common/pipes/object-id.pipe';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly usersService: UsersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Mutation(() => Post)
  async createPost(
    @CurrentUser() user: AuthenticatedUser,
    @Args('createPostInput') createPostInput: CreatePostInput,
  ): Promise<Post> {
    assertCanAccessUser(user, createPostInput.userId);

    return this.postsService.create(createPostInput);
  }

  @Query(() => [Post], { name: 'getPosts' })
  async findAll(@Args() { skip, limit }: PaginationArgs): Promise<Post[]> {
    return this.postsService.findAll({
      skip: skip,
      limit: limit,
    });
  }

  @Query(() => Post, { nullable: true, name: 'getPostById' })
  async findOne(
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<Post | null> {
    return this.postsService.findOne({ _id: id });
  }

  @ResolveField(() => User, { nullable: true })
  async user(@Parent() { userId }: Post): Promise<User | null> {
    return this.usersService.findOne({ _id: userId });
  }

  @ResolveField(() => [Category], { nullable: true })
  async categories(@Parent() { categoryIds }: Post): Promise<Category[]> {
    if (!categoryIds?.length) {
      return [];
    }

    return this.categoriesService.findAll({
      where: { _id: { $in: categoryIds } },
    });
  }

  @Mutation(() => Post, { nullable: true, name: 'updatePost' })
  async updatePost(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<any> {
    const post = await this.postsService.findOne({ _id: id });

    if (!post) {
      return null;
    }

    assertCanAccessUser(user, post.userId);

    return this.postsService.update({
      where: { _id: id },
      data: updatePostInput,
    });
  }

  @Mutation(() => Post, { nullable: true, name: 'removePost' })
  async removePost(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => ID }, ObjectIdPipe) id: string,
  ): Promise<any> {
    const post = await this.postsService.findOne({ _id: id });

    if (!post) {
      return null;
    }

    assertCanAccessUser(user, post.userId);

    return this.postsService.remove({ _id: id });
  }
}
