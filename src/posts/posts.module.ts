import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsModule } from '../comments/comments.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [CommentsModule]
})
export class PostsModule { }
