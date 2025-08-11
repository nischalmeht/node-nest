import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),  // <-- Correctly importing the Post entity
  ],
  controllers: [PostController],       // <-- Controller where your routes are defined
  providers: [PostService],            // <-- Service where your business logic resides
})
export class PostModule {}
