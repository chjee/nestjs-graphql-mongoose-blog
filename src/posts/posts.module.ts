import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { UsersModule } from './../users/users.module';
import { CategoriesModule } from './../categories/categories.module';

@Module({
  exports: [PostsService],
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    forwardRef(() => UsersModule),
    CategoriesModule,
  ],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
