import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { SubforumController } from '../services/Subforum/SubforumController';
import { SubforumService } from '../services/Subforum/SubforumService';

export const subforumRoutes = express.Router();

const subforumService = new SubforumService();
const subforumController = new SubforumController(subforumService);

const asyncHandler = (fn:RequestHandler) => (req:Request, res:Response, next:NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

subforumRoutes.get('/', asyncHandler(subforumController.getAllSubforums));
subforumRoutes.get('/:id', asyncHandler(subforumController.getSubforum));
subforumRoutes.post('/', asyncHandler(subforumController.createSubforum));
subforumRoutes.put('/:id', asyncHandler(subforumController.updateSubforum));
subforumRoutes.delete('/:id', asyncHandler(subforumController.deleteSubforum));