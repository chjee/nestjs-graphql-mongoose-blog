import { InputType, Field } from '@nestjs/graphql';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

@InputType({ description: 'Create Post Input' })
export class CreatePostInput {
  @Field(() => String, { description: 'Post Title' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  title!: string;

  @Field(() => Boolean, { defaultValue: false, description: 'Post Published' })
  @IsBoolean()
  published!: boolean;

  @Field(() => String, { description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  userId!: string;

  @Field(() => [String], { nullable: true, description: 'Post Categories' })
  @IsOptional()
  @IsString({ each: true })
  @Length(2, 60, { each: true })
  categoryIds?: string[];
}
