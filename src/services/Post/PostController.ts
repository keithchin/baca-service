import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import { PostService } from './PostService';

export class PostController {
  constructor(private readonly postService: PostService) {}

  public createPost = async (req: Request, res: Response) => {
    try {
      const post = await this.postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error creating post');
    }
  };

  public getAllPosts = async (req: Request, res: Response) => {
    try {
      const posts = await this.postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting posts');
    }
  };

  public getPost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.getPostById(new mongoose.Schema.Types.ObjectId(postId));
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting post');
    }
  };

  public updatePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.updatePostById(new mongoose.Schema.Types.ObjectId(postId), req.body);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating post');
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      await this.postService.deletePostById(new mongoose.Schema.Types.ObjectId(postId));
      res.status(200).send('Post deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting post');
    }
  };
}