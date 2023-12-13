import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType({ description: 'Create profile input' })
export class CreateProfileInput {
  @Field(() => String, { description: 'User Bio' })
  @IsNotEmpty()
  @IsString()
  bio!: string;

  @Field(() => String, { description: 'User ID' })
  @IsNotEmpty()
  @IsString()
  userId!: string;
}
