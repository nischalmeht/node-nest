import { Injectable, NotFoundException } from '@nestjs/common';
// import { Post } from './interfaces/post.interface';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entities';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class PostService {
    constructor(@InjectRepository(Post)
    private postsRepository: Repository<Post>,){}
    // private posts:Post[]=[
    //     {
    //         id:1,
    //         title:"First",
    //         content:"First Post Content",
    //         authorName:"Nischal",
    //         createdAt:new Date(),

    //     }
    // ];
    // findAll():Post[]{
    //     return  this.posts
    // }
    // async findOne(id:number):Promise<Post>{
    //     const singlePost= await this.postsRepository.find({ where: { id },})
    //     if(!singlePost){
    //         throw new NotFoundException('Post with id is not Found')
    //     }
    //     return singlePost
    //     // return singlePost
    // }
    
    async findOne(id: number): Promise<Post> {
        const singlePost = await this.postsRepository.findOne({ where: { id } });
        if (!singlePost) {
            throw new NotFoundException(`Post with id ${id} not found`);
        }
        return singlePost;
    }
    
    // create(data: Omit<Post, 'id' | 'createdAt'>): Post {
    //     const newPost: Post = {
    //       id: this.posts.length + 1,
    //       createdAt: new Date(),
    //       ...data,
    //     };
    //     this.posts.push(newPost);
    //     return newPost;
    //   }
    //   private getNextId():number{
    //     return this.posts.length>0
    //     ? Math.max(...this.posts.map(post=>post.id))+1:1
    // }
    // remove(id:number):{message:string}{
    //     const currentPostIndex=this.posts.findIndex(post=>post.id===id)
    //     if(currentPostIndex===-1){
    //         throw new NotFoundException(`Post with ${id} is not longer`)
    //     }
    //     this.posts.splice(currentPostIndex,1)
    //     return {
    //         message:`Post with ID ${id} has been deleted`
    //     }
    // }
}
