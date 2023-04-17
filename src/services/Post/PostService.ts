import { Model, ObjectId, Types } from 'mongoose';
import { IPost } from '@src/interfaces/Post/IPost';
import { IPostService } from '@src/interfaces/Post/IPostService';
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import postModel from './PostModel';
import CreatePostDto from '@src/dto/Post/CreatePostDto';
import UpdatePostDto from '@src/dto/Post/UpdatePostDto';

const PostModel: Model<IPost> = postModel;

export class PostService implements IPostService {
    constructor(
        private readonly userService: IUserService,
        private readonly subforumService: ISubforumService
    ) {}
    
  public async getAllPosts(): Promise<IPost[]> {
    return await PostModel.find({});
  }

  public async getPostById(postId: ObjectId): Promise<IPost | null> {
    return await PostModel.findById(postId);
  }

  public async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    const post = new PostModel(createPostDto);
    await post.save();
    return post;
  }

  public async updatePostById(postId: ObjectId, update: UpdatePostDto): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(postId, update, { new: true });
  }

  public async deletePostById(postId: ObjectId): Promise<number> {
    const result = await PostModel.deleteOne({ _id: postId });
    return result.deletedCount ?? 0;
  }
  
  public async upvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost> {
    const post = await PostModel.findById(postId);
  
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
  
  public async downvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost> {
    const post = await PostModel.findById(postId);
  
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
  
  public async getPostsBySubforum(subforumId: ObjectId): Promise<IPost[]> {
    return await PostModel.find({ subforum: subforumId });
  }

  public async getPostsByAuthor(authorId: ObjectId): Promise<IPost[]> {
    return await PostModel.find({ author: authorId });
  }

  public async removeAll(): Promise<void> {
    try {
      await PostModel.deleteMany({});
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}