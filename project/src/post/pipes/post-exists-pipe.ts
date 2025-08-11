import {
    ArgumentMetadata,
    Injectable,
    NotFoundException,
    PipeTransform,
  } from '@nestjs/common';
  import { PostService } from '../post.service';
  @Injectable()
  export class PostExistsPipe implements PipeTransform {
    constructor(private readonly postsService: PostService) {}
  
    transform(value: any, metadata: ArgumentMetadata) {
      try {
        this.postsService.findOne(value);
      } catch (e) {
        throw new NotFoundException(`Post with ID ${value} not found`);
      }
      return value;
    }
  }
  