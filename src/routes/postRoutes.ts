import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { PostController } from '../services/Post/PostController';
import { PostService } from '../services/Post/PostService';
import { UserService } from '../services/User/UserService';
import { SubforumService } from '../services/Subforum/SubforumService';

export const postRoutes = express.Router();

const userService = new UserService();
const subforumService = new SubforumService();
const postService = new PostService(userService,subforumService);
const postController = new PostController(postService);

const asyncHandler = (fn:RequestHandler) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  
postRoutes.get('/', postController.getAllPosts);
postRoutes.post('/', postController.createPost);
postRoutes.post('/:id', postController.getPost);
postRoutes.put('/:id', postController.updatePost);
postRoutes.delete('/:id', postController.deletePost);