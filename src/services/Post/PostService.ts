import { Model , Types } from 'mongoose';
import { IPost } from '@src/interfaces/Post/IPost';
import { IPostService } from '@src/interfaces/Post/IPostService';
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import postModel from './PostModel';
import CreatePostDto from '@src/dto/Post/CreatePostDto';
import UpdatePostDto from '@src/dto/Post/UpdatePostDto';

const PostModel: Model<IPost> = postModel;
const ObjectId = require('mongodb').ObjectId;

export class PostService implements IPostService {
    constructor(
        private readonly userService: IUserService,
        private readonly subforumService: ISubforumService
    ) {}
    
  public async getAllPosts(): Promise<IPost[]> {
    return await PostModel.find({})
    .populate('authorId', 'username')
    .populate('subforumId');
  }

  public async getPostById(postId: String): Promise<IPost | null> {
    return await PostModel.findById(postId).populate('authorId');
  }

  public async createPost(createPostDto: CreatePostDto): Promise<IPost> {
    console.log(createPostDto.author._id);
    const user = await this.userService.getUserById(createPostDto.author._id);

    if (!user) {
      throw new Error('User not found');
    }
  

    const post = new PostModel(createPostDto);
    post.voteScore = 0;
    post.upvotedBy = []; // Initialize upvotedBy as an empty array
    post.downvotedBy = []; // Initialize downvotedBy as an empty array
    await post.save();

    return post;
  }

  public async updatePostById(postId: String, update: UpdatePostDto): Promise<IPost | null> {
    return await PostModel.findByIdAndUpdate(postId, update, { new: true });
  }

  public async deletePostById(postId: String): Promise<number> {
    const result = await PostModel.deleteOne({ _id: postId });
    return result.deletedCount ?? 0;
  }
  
  public async upvotePost(userId: String, postId: String): Promise<{ status: number, message: string, post?: IPost }> {
    console.log('user id : ' + userId);
    const user = await this.userService.getUserById(userId);
    const post = await this.getPostById(postId);
  
    if (!user) {
      return { status: 404, message: 'User not found' };
    }
  
    if (!post) {
      return { status: 404, message: 'Post not found' };
    }
  
    // if (post.authorId.toString() === userId.toString()) {
    //   throw new Error('Cannot upvote own post.');
    // }

    const existingUpvote = await PostModel.findOne({
      _id: postId,
      upvotedBy: userId,
    });
  
    if (existingUpvote) {
      return { status: 400, message: 'User has already upvoted this post.' };
    }
  
  
    const existingDownvote = await PostModel.findOne({
      _id: postId,
      downvotedBy: userId,
    });
  
    if (existingDownvote) {
      await PostModel.updateOne(
        { _id: postId.toString() },
        {
          $pull: { downvotedBy: userId.toString() },
          $push: { upvotedBy: userId.toString() },
          $inc: { voteScore: 1 },
        }
      );
    } else {
      await PostModel.updateOne(
        { _id: postId.toString() },
        {
          $push: { upvotedBy: userId.toString() },
          $inc: { voteScore: 1 },
        }
      );
    }
  
    const upvotedPost = await this.getPostById(postId);
    if (!upvotedPost) {
      return { status: 404, message: 'Post not found' };
    }



    post.upvotedBy = upvotedPost.upvotedBy;
    post.downvotedBy = upvotedPost.downvotedBy;
    post.voteScore = Math.max(upvotedPost.voteScore, 0);


    return { status: 200, message: 'Post upvoted successfully', post: upvotedPost };
  }

  public async downvotePost(userId: String, postId: String): Promise<{ status: number, message: string, post?: IPost }> {
    const user = await this.userService.getUserById(userId);
    const post = await this.getPostById(postId);
  
    if (!user) {
      return { status: 404, message: 'User not found' };
    }
  
    if (!post) {
      return { status: 404, message: 'Post not found' };
    }
  
    const existingDownvote = await PostModel.findOne({
      _id: post._id,
      downvotedBy: userId.toString(),
    });

    if (existingDownvote) {
      return { status: 400, message: 'User has already downvoted this post.' };
    }
  
    const existingUpvote = await PostModel.findOne({
      _id: post._id,
      upvotedBy: userId.toString(),
    });
  
    if (existingUpvote) {
      // Change the user's upvote to a downvote
      await PostModel.updateOne(
        { _id: post._id },
        {
          $pull: { upvotedBy: userId.toString() },
          $push: { downvotedBy: userId.toString() },
          $inc: { voteScore: -1 },
        }
      );
    } else {
      // Add a downvote for the user
      await PostModel.updateOne(
        { _id: post._id },
        {
          $push: { downvotedBy: userId.toString() },
          $inc: { voteScore: -1 },
        }
      );
    }
  
    const downvotedPost = await PostModel.findOne({ _id: postId }, { upvotedBy: 1, downvotedBy: 1, voteScore: 1, _id: 0 });
    
    if (!downvotedPost) {
      return { status: 404, message: 'Post not found' };
    }

    post.upvotedBy = downvotedPost.upvotedBy;
    post.downvotedBy = downvotedPost.downvotedBy;
    post.voteScore = Math.max(downvotedPost.voteScore, 0);


    return { status: 200, message: 'Post upvoted successfully', post: downvotedPost };
  }
  
  public async getPostsBySubforum(subforumId: String): Promise<IPost[]> {
    return await PostModel.find({ subforum: subforumId });
  }

  public async getPostsByAuthor(authorId: String): Promise<IPost[]> {
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