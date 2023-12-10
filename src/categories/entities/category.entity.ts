import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { Post } from './../../posts/entities/post.entity';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ versionKey: false, timestamps: true })
@ObjectType({ description: 'Category model' })
export class Category {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  @Field(() => String, { description: 'Category ID' })
  _id!: string;

  @Prop({ type: String, required: true, trim: true, unique: true })
  @Field(() => String, { description: 'Category name' })
  name!: string;

  @Field(() => [Post], { description: 'User posts' })
  posts?: Post[] | null;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
