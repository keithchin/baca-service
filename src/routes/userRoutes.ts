import express from 'express';
import { UserController } from '../services/User/UserController';
import { UserService } from '../services/User/UserService';

export const userRoutes = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.get('/', userController.getAllUsers);
userRoutes.get('/:id', userController.getUserById);
userRoutes.post('/', userController.createUser);
userRoutes.put('/:id', userController.updateUserById);
userRoutes.delete('/:id', userController.deleteUserById);