import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { INestApplication, Provider, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test } from '@nestjs/testing';

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
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.init();

  return app;
}
