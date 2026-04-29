import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType({ description: 'SignIn user input' })
export class SignInInput {
  @Field(() => String, { description: 'User Email' })
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 60)
  email!: string;

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 20)
  password!: string;
}

@ObjectType({ description: 'Sign In Output' })
export class SignInOutput {
  @Field(() => String, { nullable: true, description: 'JWT Token' })
  token?: string | null;
}
