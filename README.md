<h1 align="center">Welcome to nestjs-graphql-mongoose-blog 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.1-blue.svg?cacheSeconds=2592000" />
  <img src="https://img.shields.io/badge/node-%3E%3D20-blue.svg" />
  <img src="https://img.shields.io/badge/npm-%3E%3D10-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: UNLICENSED" src="https://img.shields.io/badge/License-UNLICENSED-yellow.svg" />
  </a>
</p>

> NestJS, GraphQL, mongoose, MongoDB, Typescript를 이용한 BLOG API

## Prerequisites

- node >=20
- npm >=10
- MongoDB instance for local application runtime

## Install

```sh
$ npm install
```

## Usage

```sh
# development mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The application loads environment variables from `.env.dev` first and then `.env`.
`JWT_SECRET` is required at startup.

## Run tests

```sh
# unit tests
$ npm run test

# unit tests with watch mode
$ npm run test:watch

# unit tests with coverage
$ npm run test:cov

# e2e tests
$ npm run test:e2e

# opt-in MongoDB-backed smoke test
$ MONGO_URI=mongodb://127.0.0.1:27017/blog-local \
  JWT_SECRET=MDBjMWJlMzc4M2JhNGExY2FmNTRkZmU0NjlhNTRjYmY= \
  npm run test:e2e:mongo
```

The default e2e suite uses a lightweight GraphQL test module and mocked services.
It does not connect to MongoDB. Use local application startup or a separate smoke
test when you need to verify the real `AppModule` with `MONGO_URI`.

`npm run test:e2e:mongo` starts the real `AppModule`, connects to `MONGO_URI`,
and verifies the GraphQL endpoint through the public `login` mutation. It is
opt-in so the regular test suite does not require a running MongoDB instance.
When using the sibling `docker-local-infra` repository, start MongoDB with
`make up-mongodb` and run the smoke test with
`MONGO_URI=mongodb://devuser:devpass3992@127.0.0.1:27017/blog`.

## .env file

```sh
# .env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/blog-local
SALT_ROUNDS=10
JWT_SECRET=MDBjMWJlMzc4M2JhNGExY2FmNTRkZmU0NjlhNTRjYmY=
```

## API notes

- `login` and `createUser` are public GraphQL mutations.
- `createUser` never accepts a client-provided role. New users are created with the `USER` role by the server.
- User profile updates and role changes are separate mutations. `updateUserRole` requires an `ADMIN` JWT role.
- `User.password` is stored for authentication but is not exposed in the GraphQL output type.
- List queries accept flat pagination arguments: `skip` and `limit`.
- Pagination constraints are shared across list queries: `skip >= 0`, `1 <= limit <= 100`.

Example:

```graphql
query {
  getPosts(skip: 0, limit: 10) {
    id
    title
    published
  }
}
```

### Mutation examples

Public sign-in:

```graphql
mutation {
  login(signInInput: { email: "admin@example.com", password: "password123" }) {
    token
  }
}
```

Public user registration. The server assigns the `USER` role:

```graphql
mutation {
  createUser(
    createUserInput: {
      email: "new-user@example.com"
      name: "New User"
      password: "password123"
    }
  ) {
    id
    email
    name
    role
  }
}
```

Authenticated profile update. This mutation does not change roles:

```graphql
mutation {
  updateUser(id: "<USER_ID>", updateUserInput: { name: "Updated Name" }) {
    id
    email
    name
    role
  }
}
```

Admin-only role change. Send `Authorization: Bearer <ADMIN_JWT>` with the request:

```graphql
mutation {
  updateUserRole(id: "<USER_ID>", updateUserRoleInput: { role: "ADMIN" }) {
    id
    email
    role
  }
}
```

## Dependency notes

The project is on NestJS 11, Apollo Server 5, and Mongoose 8 via `@nestjs/mongoose` 11.
`@as-integrations/express5` is required by the Apollo/Nest Express 5 integration.

Known audit status:

- `npm audit --omit=dev` reports 5 moderate advisories from `@apollo/server -> uuid@11`.
- GitHub Dependabot alert #95 tracks `GHSA-w5hq-g745-h8pq` for transitive `uuid < 14.0.0`.
- As of 2026-05-01, `@apollo/server@5.5.0` still depends on `uuid@^11.1.0`.
- Forcing `uuid@14` with npm overrides was tested and rejected because Apollo/Nest e2e startup fails under the current CommonJS test/runtime path with `SyntaxError: Unexpected token 'export'`.
- Revisit this when `@apollo/server` publishes a compatible update that removes the vulnerable `uuid` range, or when the test/runtime path is moved to an ESM-compatible setup.

## Author

👤 **Changhoon Jee <chjee71@gmail.com>**

- Github: [@chjee](https://github.com/chjee)

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
