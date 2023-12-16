import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User, UserSchema } from './entities/user.entity';
import { Post, PostSchema } from './../posts/entities/post.entity';
import { PostsService } from './../posts/posts.service';
import { Profile, ProfileSchema } from './../profiles/entities/profile.entity';
import { ProfilesService } from './../profiles/profiles.service';

@Module({
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Profile.name, schema: ProfileSchema },
    ]),
  ],
  providers: [UsersResolver, UsersService, PostsService, ProfilesService],
})
export class UsersModule {}
