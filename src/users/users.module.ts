import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User, UserSchema } from './entities/user.entity';
import { PostsModule } from './../posts/posts.module';
import { ProfilesModule } from './../profiles/profiles.module';

@Module({
  exports: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => PostsModule),
    forwardRef(() => ProfilesModule),
  ],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
