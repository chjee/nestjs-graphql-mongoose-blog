import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Post } from './../../posts/entities/post.entity';
import { Profile } from './../../profiles/entities/profile.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ versionKey: false, timestamps: true })
@ObjectType({ description: 'User model' })
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  @Field(() => String, { description: 'User id' })
  _id!: string;

  @Field(() => String, { description: 'User slug' })
  id!: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  @Field(() => String, { description: 'User email' })
  email!: string;

  @Prop({ type: String, required: true, trim: true })
  @Field(() => String, { description: 'User name' })
  name!: string;

  @Prop({ type: String, required: true, trim: true })
  @Field(() => String, { description: 'User password' })
  password!: string;

  @Prop({ type: String, required: true, trim: true, default: 'USER' })
  @Field(() => String, { description: 'User role' })
  role!: string;

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'User created date' })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'User updated date' })
  updatedAt?: Date;

  @Field(() => [Post], { nullable: true, description: 'User posts' })
  posts?: Post[];

  @Field(() => Profile, { nullable: true, description: 'User profile' })
  profile?: Profile;
}

export const UserSchema = SchemaFactory.createForClass(User);
