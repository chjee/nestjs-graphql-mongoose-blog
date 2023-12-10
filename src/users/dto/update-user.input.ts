import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType({ description: 'Update user input' })
export class UpdateUserInput extends PickType(PartialType(CreateUserInput), [
  'name',
  'role',
] as const) {}
