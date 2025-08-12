import { Module } from '@nestjs/common';
// import { PostController } from './post.controller';
// import { PostService } from './post.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entities';
import { PostService } from './post.service';
import { AuthModule } from 'src/auth/auth.module';
import { PostController } from './post.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),  // <-- Correctly importing the Post entity
    AuthModule
  ],
  controllers: [PostController],       // <-- Controller where your routes are defined
  providers: [PostService],            // <-- Service where your business logic resides
})
export class PostModule {}
