import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class CreateCategoryInput {
  @Field(() => String, { description: 'Category name' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 60)
  name!: string;
}
