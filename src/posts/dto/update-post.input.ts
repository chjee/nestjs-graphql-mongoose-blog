import { InputType, PartialType, PickType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType({ description: 'Update Post Input' })
export class UpdatePostInput extends PickType(PartialType(CreatePostInput), [
  'title',
  'published',
  'categoryIds',
] as const) {}
