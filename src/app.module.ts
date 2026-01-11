import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    PostsModule,
    RouterModule.register([
      {
        path: "posts",
        module: PostsModule,
        children: [
          {
            path: ":post_id/comments",
            module: CommentsModule
          }
        ]
      }
    ]),
    AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
