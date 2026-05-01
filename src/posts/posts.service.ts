import { Injectable } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private posts: Model<Post>) {}
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

    const posts = await this.posts
      .find(where || {})
      .sort(orderBy || '-createdAt')
      .skip(Math.max(skip ?? 0, 0))
      .limit(Math.min(Math.max(limit ?? 10, 1), 100))
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
