import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication, Provider } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';
import { configureApp } from '../src/common/configure-app';

export async function createGraphqlTestApp(
  providers: Provider[],
): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({
    imports: [
      GraphQLModule.forRoot<ApolloDriverConfig>({
        driver: ApolloDriver,
        autoSchemaFile: true,
        sortSchema: true,
        context: ({ req }) => ({ req }),
      }),
    ],
    providers,
  }).compile();

  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();

  return app;
}
