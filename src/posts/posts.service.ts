import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private posts: Model<Post>) {}
  private readonly logger = new Logger(PostsService.name);

  async create(createPostInput: CreatePostInput): Promise<Post> {
    const post = new this.posts(createPostInput);
    return post.save();
  }

  async findAll(params: { skip?: number; limit?: number }): Promise<Post[]> {
    const { skip, limit } = params;
    const count = await this.posts.countDocuments().exec();

    if (count <= 0) {
      this.logger.error('No posts found');
      throw new NotFoundException('No posts found');
    }

    const posts = await this.posts
      .find()
      .sort('-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return posts;
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.posts.findById({ _id: id }).exec();

    if (!post) {
      this.logger.error(`Post with id ${id} not found`);
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostInput: UpdatePostInput): Promise<any> {
    return this.posts
      .findByIdAndUpdate({ _id: id }, { $set: updatePostInput }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<any> {
    return this.posts.findByIdAndDelete({ _id: id }).exec();
  }
}
