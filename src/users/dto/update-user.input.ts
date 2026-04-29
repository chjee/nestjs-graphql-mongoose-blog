import { Field, InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';
import { IsIn, IsOptional } from 'class-validator';

@InputType({ description: 'Update user input' })
export class UpdateUserInput extends PickType(PartialType(CreateUserInput), [
  'name',
] as const) {
  @Field(() => String, { nullable: true, description: 'User Role' })
  @IsOptional()
  @IsIn(['ADMIN', 'USER'])
  role?: string;
}
