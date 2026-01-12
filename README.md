## Description

This project is developed using NestJS integrated with Prisma to connect to a PostgreSQL database. This is a simple REST API to be used for a small blog application.

### Schema
```
model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User?     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    Int?
}

model Comment {
  id        Int      @id @default(autoincrement())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  post      Post?    @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int?
  user      User?    @relation(fields: [userId], references: [id])
  userId    Int?
}

model User {
  id        Int       @id @default(autoincrement())
  username  String
  password  String
  role      Role      @default(user)
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

enum Role {
  user
  admin
}
```

This is the schema for the database of this project. The relationship is as follows:
- A User can contain Posts and Comments
- A Post can contain Comments

If a Post or User gets deleted, any relation that is contained within that Post or User also gets deleted. This is done to prevent unnecessary items left in the database.

### Auth Routes
```
POST /auth/login
POST /auth/signup
```
The auth routes were developed to handle user login and authentication. It is separated from other CRUD operations due to how differently it's handled. It uses the `bcrypt` module to hash the passwords users input for security.

#### JWT Token

When a user successfully log in, a JWT token is generated that contains the user's id. This token is used as an Authorization Bearer token in requests in other routes. When making a request, the user's id is taken from the token's payload to extract more detailed user information. This is then included in the request for the respective action to handle any operations involving the current logged in user.

### Users Routes
```
POST   /users
GET    /users
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

The users routes include actions related to User CRUD operations. Aside from GET request routes, the other routes includes a check to see whether the user is authorized to perform the action. Creating a new user and deleting one can only be done by an `admin`, otherwise a `ForbiddenException` is thrown. For updating a user, an `admin` can update any user, while regular users can only update their own user information. This prevents any unauthorized actions in the user routes.

### Posts Routes
```
POST   /posts
GET    /posts
GET    /posts/:id
PATCH  /posts/:id
DELETE /posts/:id
```

The posts routes include actions related to Posts CRUD operations. Some of the post routes require the user extracted from the request object to connect posts to users when added or updated. This is done to properly link a user to the post

### Comments Routes
```
POST   /posts/:post_id/comments
GET    /posts/:post_id/comments
GET    /posts/:post_id/comments/:comment_id
PATCH  /posts/:post_id/comments/:comment_id
DELETE /posts/:post_id/comments/:comment_id
```

The comments routes include actions related to Comments CRUD operations. Simarly to post routes, the user is exctracted from the request object to connect comments to the user. Additionally, the comments routes is a subroute of a post to extract the post is from the route to connect the comment to the post when adding or updating a comment.

### Unit Tests

The test for each module can be found and reviewed within their respective folders. The modules in question are `users`, `posts`, `comments`, and `auth`

## Project setup

Install the required packages using the command below.

```bash
$ npm install
```

Include the following to your `.env` file

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"
JWT_SECRET="A_GENERATED_JWT_SWECRET"
```

Update your database using migrations and generate Prisma client

```bash
$ npx prisma migrate dev
$ npx prisma generate
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
