import {
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
//   import { Post } from './entities/post.entity';
  import { Repository } from 'typeorm';
  import { CreatePostDto } from './dto/create-post.dto';
  import { UpdatePostDto } from './dto/update-post.dto';
//   import { User, UserRole } from 'src/auth/entities/user.entity';
  import { CACHE_MANAGER } from '@nestjs/cache-manager';
  import { Cache } from 'cache-manager';
  import { FindPostsQueryDto } from './dto/find-posts-query.dto';
import { Post } from './entities/post.entities';
import { User, UserRole } from 'src/auth/entities/user.entities';
import { PaginatedResponse } from 'src/common/interfaces/paginated-interface.inteface';
  
  @Injectable()
  export class PostService {
    private postListCachekeys: Set<string> = new Set();
  
    constructor(
      @InjectRepository(Post)
      private postsRepository: Repository<Post>,
      @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}
  
    private generatePostsListCacheKey(query: FindPostsQueryDto): string {
      const { page = 1, limit = 10, title } = query;
      return `posts_list_page${page}_limit${limit}_title${title || 'all'}`;
    }
  
    async findAll(query: FindPostsQueryDto): Promise<PaginatedResponse<Post>> {
      const cacheKey = this.generatePostsListCacheKey(query);
  
      this.postListCachekeys.add(cacheKey);
  
      const getCachedData =
        await this.cacheManager.get<PaginatedResponse<Post>>(cacheKey);
  
      if (getCachedData) {
        console.log(
          `Cache Hit --------> Returning posts list from Cache ${cacheKey}`,
        );
        return getCachedData;
      }
      console.log(`Cache Miss --------> Returning posts list from database`);
  
      const { page = 1, limit = 10, title } = query;
  
      const skip = (page - 1) * limit;
  
      const queryBuilder = this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.authorName', 'authorName')
        .orderBy('post.createdDate', 'DESC')
        .skip(skip)
        .take(limit);
  
      if (title) {
        queryBuilder.andWhere('post.title ILIKE :title', { title: `%${title}%` });
      }
  
      const [items, totalItems] = await queryBuilder.getManyAndCount();
  
      const totalPages = Math.ceil(totalItems / limit);
  
      const responseResult = {
        items,
        meta: {
          currentPage: page,
          itemsPerPage: limit,
          totalItems,
          totalPages,
          hasPreviousPage: page > 1,
          hasNextPage: page < totalPages,
        },
      };
  
      await this.cacheManager.set(cacheKey, responseResult, 30000);
      return responseResult;
    }
  
    async findOne(id: number): Promise<Post> {
      const cacheKey = `post_${id}`;
      const cachedPost = await this.cacheManager.get<Post>(cacheKey);
  
      if (cachedPost) {
        console.log(`Cache Hit --------> Returning post from Cache ${cacheKey}`);
  
        return cachedPost;
      }
  
      console.log(`Cache miss ---------> Returning post from DB`);
  
      const singlePost = await this.postsRepository.findOne({
        where: { id },
        relations: ['authorName'],
      });
  
      if (!singlePost) {
        throw new NotFoundException(`Post with ID ${id} is not found`);
      }
  
      //store the post to cache
      await this.cacheManager.set(cacheKey, singlePost, 30000);
  
      return singlePost;
    }
  
    async create(createPostData: CreatePostDto, authorName: User): Promise<Post> {
      const newlyCreatedPost = this.postsRepository.create({
        title: createPostData.title,
        content: createPostData.content,
        authorName,
      });
  
      //Invalidate the existing cache
      await this.invalidateAllExistingListCaches();
  
      return this.postsRepository.save(newlyCreatedPost);
    }
  
    async update(
      id: number,
      updatePostData: UpdatePostDto,
      user: User,
    ): Promise<Post> {
      const findPostToUpdate = await this.findOne(id);
  
      if (
        findPostToUpdate.authorName.id !== user.id &&
        user.role !== UserRole.ADMIN
      ) {
        throw new ForbiddenException('You can only update your own posts');
      }
  
      if (updatePostData.title) {
        findPostToUpdate.title = updatePostData.title;
      }
  
      if (updatePostData.content) {
        findPostToUpdate.content = updatePostData.content;
      }
  
      const updatedPost = await this.postsRepository.save(findPostToUpdate);
  
      await this.cacheManager.del(`post_${id}`);
  
      await this.invalidateAllExistingListCaches();
  
      return updatedPost;
    }
  
    async remove(id: number): Promise<void> {
      const findPostToDelete = await this.findOne(id);
  
      await this.postsRepository.remove(findPostToDelete);
  
      await this.cacheManager.del(`post_${id}`);
  
      await this.invalidateAllExistingListCaches();
    }
  
    private async invalidateAllExistingListCaches(): Promise<void> {
      console.log(
        `Invalidating ${this.postListCachekeys.size} list cache entries`,
      );
  
      for (const key of this.postListCachekeys) {
        await this.cacheManager.del(key);
      }
  
      this.postListCachekeys.clear();
    }
  }
  