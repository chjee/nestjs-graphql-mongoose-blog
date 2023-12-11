import { CreateCategoryInput } from './create-category.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType()
export class UpdateCategoryInput extends PickType(CreateCategoryInput, [
  'name',
] as const) {}
