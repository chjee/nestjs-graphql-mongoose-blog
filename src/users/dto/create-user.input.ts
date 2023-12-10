import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

@InputType({ description: 'Create user input' })
export class CreateUserInput {
  @Field(() => String, { description: 'User Email' })
  @IsNotEmpty()
  @IsEmail()
  @Length(6, 60)
  email!: string;

  @Field(() => String, { nullable: true, description: 'User Name' })
  @IsString()
  @Length(4, 60)
  name?: string;

  @Field(() => String, { description: 'Password' })
  @IsNotEmpty()
  @IsString()
  @Length(6, 60)
  password!: string;

  @Field(() => String, { description: 'User Role' })
  @IsEnum(['ADMIN', 'USER'])
  role!: string;
}
