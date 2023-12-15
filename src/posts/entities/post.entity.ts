import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from './../../users/entities/user.entity';
import { Category } from './../../categories/entities/category.entity';

export type PostDocument = HydratedDocument<Post>;

@Schema({ versionKey: false, timestamps: true })
@ObjectType({ description: 'Post Model' })
export class Post {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  @Field(() => String, { description: 'Post ID' })
  _id!: string;

  @Field(() => String, { description: 'Post slug' })
  id!: string;

  @Prop({ type: String, required: true, trim: true })
  @Field(() => String, { description: 'Post Title' })
  title!: string;

  @Prop({ type: Boolean, default: false })
  @Field(() => Boolean, { defaultValue: false, description: 'Post Published' })
  published!: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => String, { description: 'User ID' })
  userId!: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Category' }] })
  @Field(() => [String], { nullable: true, description: 'Post Categories' })
  categoryIds?: string[];

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'Post created date' })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'Post updated date' })
  updatedAt?: Date;

  @Field(() => User, { nullable: true, description: 'User Object' })
  user?: User | null;

  @Field(() => [Category], { nullable: true, description: 'Post Categories' })
  categories?: Category[] | null;
}

export const PostSchema = SchemaFactory.createForClass(Post);
