import { Module, forwardRef } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesResolver } from './profiles.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { UsersModule } from './../users/users.module';

@Module({
  exports: [ProfilesService],
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    forwardRef(() => UsersModule),
  ],
  providers: [ProfilesResolver, ProfilesService],
})
export class ProfilesModule {}
