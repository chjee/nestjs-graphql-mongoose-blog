import { InputType, PickType } from '@nestjs/graphql';
import { CreatePostInput } from './create-post.input';

@InputType({ description: 'Update Post Input' })
export class UpdatePostInput extends PickType(CreatePostInput, [
  'title',
  'published',
] as const) {}
