import { Request, Response } from 'express';
import mongoose, { Schema } from 'mongoose';
import { PostService } from './PostService';

export class PostController {
  constructor(private readonly postService: PostService) {}

  public createPost = async (req: Request, res: Response) => {
    try {
      const { authorId, subforumId } = req.body;
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
      const { id } = req.params;
      console.log(req.params);
      console.log(id);
      const post = await this.postService.getPostById(id);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting post');
    }
  };

  public getPostsBySubforum = async (req: Request, res: Response) => {
    try {
      const { subforumId } = req.params;
      const post = await this.postService.getPostsBySubforum(subforumId);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error getting post');
    }
  }

  public updatePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.updatePostById(postId, req.body);
      res.status(200).json(post);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error updating post');
    }
  };

  public deletePost = async (req: Request, res: Response) => {
    try {
      const { postId } = req.params;
      await this.postService.deletePostById(postId);
      res.status(200).send('Post deleted successfully');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error deleting post');
    }
  };

  public setVote = async (req: Request, res: Response) => {
    try {
      const { userId, postId, voteType } = req.body;
      console.log("req body" + JSON.stringify(req.body));
      let voteScore;
      if(voteType === 'downvote') {
        voteScore = await this.postService.downvotePost(userId, postId);
      } else {
        voteScore = await this.postService.upvotePost(userId, postId);
      }
      res.status(200).json({ voteScore });
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error. Can't ${req.body.voteType} post.`)
    }
  }
}