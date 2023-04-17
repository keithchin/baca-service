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
    post.voteScore = 0; 
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
  
  public async upvotePost(userId: ObjectId, postId: ObjectId): Promise<IPost> {
    const user = await this.userService.getUserById(userId);
    const post = await this.getPostById(postId);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    const existingUpvote = await PostModel.findOne({
      _id: post._id,
      upvotedBy: userId,
    });
  
    if (existingUpvote) {
      throw new Error('User has already upvoted this post.');
    }
  
    const existingDownvote = await PostModel.findOne({
      _id: post._id,
      downvotedBy: userId,
    });
  
    if (existingDownvote) {
      await PostModel.updateOne(
        { _id: post._id },
        {
          $pull: { downvotedBy: userId },
          $push: { upvotedBy: userId },
          $inc: { voteScore: 2 },
        }
      );
    } else {
      await PostModel.updateOne(
        { _id: post._id },
        {
          $push: { upvotedBy: userId },
          $inc: { voteScore: 1 },
        }
      );
    }
  
    const upvotedPost = await this.getPostById(postId);
    if (!upvotedPost) {
      throw new Error('Post not found');
    }
  
    if (post.authorId.toString() === userId.toString()) {
      throw new Error('Cannot upvote own post.');
    }
  
    return upvotedPost;
  }
    

  public async downvotePost(userId: ObjectId, postId: ObjectId): Promise<IPost> {
    const user = await this.userService.getUserById(userId);
    const post = await this.getPostById(postId);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    const existingDownvote = await PostModel.findOne({
      _id: post._id,
      downvotedBy: userId.toString(),
    });
  
    if (existingDownvote) {
      throw new Error('User has already downvoted this post.');
    }
  
    const existingUpvote = await PostModel.findOne({
      _id: post._id,
      upvotedBy: userId.toString(),
    });
  
    if (existingUpvote) {
      await PostModel.updateOne(
        { _id: post._id },
        {
          $pull: { upvotedBy: userId.toString() },
          $push: { downvotedBy: userId.toString() },
          $inc: { voteScore: -2 },
        }
      );
    } else {
      await PostModel.updateOne(
        { _id: post._id },
        {
          $push: { downvotedBy: userId.toString() },
          $inc: { voteScore: -1 },
        }
      );
    }
  
    const downvotedPost = await this.getPostById(postId);
    if (!downvotedPost) {
      throw new Error('Post not found');
    }
  
    return downvotedPost;
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