import { Model, ObjectId, Types } from 'mongoose';
import { IPost } from '@src/interfaces/Post/IPost';
import { IPostService } from '@src/interfaces/Post/IPostService';
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import PostModel from './PostModel';
import CreatePostDto from '@src/dto/Post/CreatePostDto';
import UpdatePostDto from '@src/dto/Post/UpdatePostDto';

const Post: Model<IPost> = PostModel;

export class PostService implements IPostService {
    constructor(
        private readonly userService: IUserService,
        private readonly subforumService: ISubforumService
    ) {}
    
  async getAllPosts(): Promise<IPost[]> {
    return await Post.find({});
  }

  async getPostById(postId: ObjectId): Promise<IPost | null> {
    return await Post.findById(postId);
  }

  async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    const post = new Post(createPostDto);
    await post.save();
    return post;
  }

  async updatePostById(postId: ObjectId, update: UpdatePostDto): Promise<IPost | null> {
    return await Post.findByIdAndUpdate(postId, update, { new: true });
  }

  async deletePostById(postId: ObjectId): Promise<boolean> {
    const result = await Post.deleteOne({ _id: postId });
    return result.deletedCount === 1;
  }
  
  async upvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost> {
    const post = await Post.findById(postId);
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    const userAlreadyUpvoted = post.upvotes.some(upvote => upvote === userId);
    if (!userAlreadyUpvoted) {
      post.upvotes.push(userId);
      await post.save();
    }
  
    return post;
  }
  
  async downvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost> {
    const post = await Post.findById(postId);
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    const userAlreadyDownvoted = post.downvotes.some(downvote => downvote === userId);
    if (!userAlreadyDownvoted) {
      post.downvotes.push(userId);
      await post.save();
    }
  
    return post;
  }
  
  async getPostsBySubforum(subforumId: ObjectId): Promise<IPost[]> {
    return await Post.find({ subforum: subforumId });
  }

  async getPostsByAuthor(authorId: ObjectId): Promise<IPost[]> {
    return await Post.find({ author: authorId });
  }
}