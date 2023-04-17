import { ObjectId } from 'mongoose';
import { IPost } from "./IPost";
import CreatePostDto from "@src/dto/Post/CreatePostDto";
import UpdatePostDto from "@src/dto/Post/UpdatePostDto";

export interface IPostService {
  getAllPosts(): Promise<IPost[]>;
  getPostById(postId: ObjectId): Promise<IPost | null>;
  createPost(createPostDto: CreatePostDto): Promise<IPost>;
  updatePostById(postId: ObjectId, update: UpdatePostDto): Promise<IPost | null>;
  deletePostById(postId: ObjectId): Promise<number>;
  upvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost>;
  downvotePost(postId: ObjectId, userId: ObjectId): Promise<IPost>;
  getPostsBySubforum(subforumId: ObjectId): Promise<IPost[]>;
  getPostsByAuthor(authorId: ObjectId): Promise<IPost[]>;
  removeAll(): Promise<void>;
}