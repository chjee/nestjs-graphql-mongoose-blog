import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, HydratedDocument } from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ versionKey: false, timestamps: true })
@ObjectType({ description: 'Profile model' })
export class Profile {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true, required: true })
  @Field(() => String, { description: 'User id' })
  _id!: string;

  @Prop({ type: String, required: true, trim: true })
  @Field(() => String, { description: 'User Bio' })
  bio!: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }] })
  @Field(() => String, { description: 'User ID' })
  userId!: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
