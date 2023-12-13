import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';
import { User } from './../../users/entities/user.entity';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false, timestamps: true })
@ObjectType({ description: 'Profile model' })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  @Field(() => String, { description: 'User id' })
  _id!: string;

  @Field(() => String, { description: 'Profile slug' })
  id!: string;

  @Prop({ type: String, required: true, trim: true })
  @Field(() => String, { description: 'User Bio' })
  bio!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => String, { description: 'User ID' })
  userId!: string;

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'Profile created date' })
  createdAt?: Date;

  @Prop({ type: Date, default: Date.now })
  @Field(() => Date, { nullable: true, description: 'Profile updated date' })
  updatedAt?: Date;

  @Field(() => User, { nullable: true, description: 'User' })
  user?: User;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
