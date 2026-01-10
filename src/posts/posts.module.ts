import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CommentsModule } from './comments/comments.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [CommentsModule, PrismaModule]
})
export class PostsModule { }
