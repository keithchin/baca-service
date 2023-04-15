import express from 'express';
import { SubforumController } from '../services/Subforum/SubforumController';
import { SubforumService } from '../services/Subforum/SubforumService';


export const subforumRoutes = express.Router();

const subforumService = new SubforumService();
const subforumController = new SubforumController(subforumService);

subforumRoutes.get('/', subforumController.getAllSubforums);
subforumRoutes.get('/:id', subforumController.getSubforum);
subforumRoutes.post('/', subforumController.createSubforum);
subforumRoutes.put('/:id', subforumController.updateSubforum);
subforumRoutes.delete('/:id', subforumController.deleteSubforum);