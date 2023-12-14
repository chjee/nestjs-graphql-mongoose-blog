import { Injectable, Logger } from '@nestjs/common';
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

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: object;
    orderBy?: string;
  }): Promise<Post[]> {
    const { skip, limit, where, orderBy } = params;
    const count = await this.posts.countDocuments().exec();

    if (count <= 0) {
      this.logger.log('No posts found');
      return [];
    }

    const posts = await this.posts
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(skip || 0)
      .limit(limit || 10)
      .exec();

    return posts;
  }

  async findOne(where: object): Promise<Post | null> {
    return this.posts.findOne(where).exec();
  }

  async update(params: { where: object; data: UpdatePostInput }): Promise<any> {
    const { where, data } = params;
    return this.posts
      .findOneAndUpdate(where, { $set: data }, { new: true })
      .exec();
  }

  async remove(where: object): Promise<any> {
    return this.posts.findOneAndDelete(where).exec();
  }
}
