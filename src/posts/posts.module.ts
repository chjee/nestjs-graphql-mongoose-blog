import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { User, UserSchema } from './../users/entities/user.entity';
import { UsersService } from './../users/users.service';
import {
  Category,
  CategorySchema,
} from './../categories/entities/category.entity';
import { CategoriesService } from './../categories/categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [PostsResolver, PostsService, UsersService, CategoriesService],
})
export class PostsModule {}
