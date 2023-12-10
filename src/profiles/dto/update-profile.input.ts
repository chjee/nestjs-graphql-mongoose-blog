import { CreateProfileInput } from './create-profile.input';
import { InputType, PickType } from '@nestjs/graphql';

@InputType({ description: 'Update Profile Input' })
export class UpdateProfileInput extends PickType(CreateProfileInput, [
  'bio',
] as const) {}
