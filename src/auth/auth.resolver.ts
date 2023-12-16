import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Public } from './../common/decorators/public.decorator';
import { User } from './../users/entities/user.entity';
import { SignInInput, SignInOutput } from './../users/dto/signin-user.input';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => SignInOutput, { name: 'login' })
  async signIn(
    @Args('signInInput') signInInput: SignInInput,
  ): Promise<SignInOutput> {
    return this.authService.signIn(signInInput);
  }
}
