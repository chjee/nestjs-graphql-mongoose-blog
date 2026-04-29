import { Field, InputType } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType({ description: 'Update user role input' })
export class UpdateUserRoleInput {
  @Field(() => String, { description: 'User Role' })
  @IsIn(['ADMIN', 'USER'])
  role!: string;
}
