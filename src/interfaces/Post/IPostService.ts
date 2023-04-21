import { ObjectId } from 'mongoose';
import { IPost } from "./IPost";
import CreatePostDto from "@src/dto/Post/CreatePostDto";
import UpdatePostDto from "@src/dto/Post/UpdatePostDto";

export interface IPostService {
  getAllPosts(): Promise<IPost[]>;
  getPostById(postId: String): Promise<IPost | null>;
  createPost(createPostDto: CreatePostDto): Promise<IPost>;
  updatePostById(postId: String, update: UpdatePostDto): Promise<IPost | null>;
  deletePostById(postId: String): Promise<number>;
  upvotePost(postId: String, userId: string): Promise<IPost>;
  downvotePost(postId: String, userId: string): Promise<IPost>;
  getPostsBySubforum(subforumId: String): Promise<IPost[]>;
  getPostsByAuthor(authorId: String): Promise<IPost[]>;
  removeAll(): Promise<void>;
}