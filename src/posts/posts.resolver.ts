import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { Post } from './entities/post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';

@Resolver(() => Post)
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

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

  @Query(() => Post, { name: 'post' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Post> {
    return this.postsService.findOne(id);
  }

  @Mutation(() => Post)
  async updatePost(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePostInput') updatePostInput: UpdatePostInput,
  ): Promise<any> {
    return this.postsService.update(id, updatePostInput);
  }

  @Mutation(() => Post)
  async removePost(@Args('id', { type: () => ID }) id: string) {
    return this.postsService.remove(id);
  }
}
