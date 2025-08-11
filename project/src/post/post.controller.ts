import { Body, Controller, Get, Param, ParseIntPipe, Query, Post as HttpPost, UsePipes, ValidationPipe, Put, Post, HttpStatus, HttpCode } from '@nestjs/common';
import { PostService } from './post.service';
import { Post as PostInterface } from './interfaces/post.interface';
import { CreatePropertyDto } from 'src/dto/createProperty.dto';
import { UpdatePostDto } from 'src/dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { PostExistsPipe } from './pipes/post-exists-pipe';
import { Post as PostEntity } from './entities/post.entities';
@Controller('post')
export class PostController {
  constructor(private readonly postservice: PostService) { }
  // @Get()
  // findAll(@Query('search') search?: string): PostInterface[] {
  //   const extractAllPosts = this.postservice.findOne(1)
  //   // if (search) {
  //   //   return extractAllPosts.filter(singlePost => singlePost.title.toLowerCase().includes(search.toLowerCase()))
  //   // }
  //   return extractAllPosts
  // }
  // @Get(':id')
  // findOne(@Param('id',ParseIntPipe)PostExistsPipe,id:number):PostInterface{
  //     return this.postservice.findOne(id)
  // }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  ): Promise<PostEntity> {
    return this.postservice.findOne(id);
  }
  // @Get(':id')
  // async findOne(
  //   @Param('id', ParseIntPipe, PostExistsPipe) id: number,
  // ): Promise<PostEntity> {
  //   return this.postservice.findOne(id);
  // }
  // create(createPostData:Omit<Post,'id' | 'creaderAt'>):Post{
  //     const newPost:Post={
  //         id:
  //     }
  // }
  //   @Post('')
  //   @HttpCode(HttpStatus.CREATED)
  //   create(@Body() createPostData:CreatePostDto):PostInterface{

  // }
  // @Post('')
  // @HttpPost()
  // @UsePipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //     disableErrorMessages: true,
  //     groups: ['create'], // important!
  //   }),
  // )
  // create(@Body() body: CreatePropertyDto): PostInterface {
  //   return this.postservice.create(body);
  // }

  // @Put(':id')
  // async update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updatePostData: UpdatePostDto,      
  // ): Promise<PostInterface> {
  // //   return this.postservice.update(id, updatePostData, user);
  // }

}