import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUserService } from "@src/interfaces/User/IUserService";
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

export class UserController {
  constructor(private readonly userService: IUserService) {
    console.log('userService:', userService);
  }

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
  };

  getUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(new mongoose.Schema.Types.ObjectId(id));
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const createUserDto: CreateUpdateUserDto = req.body;
      const existingUser = await this.userService.getUserByEmail(createUserDto.email);
      if (existingUser) {
        return res.status(400).send("Email already in use");
      }
      const user = await this.userService.createUser(createUserDto);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating user");
    }
  };

  updateUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const update = req.body;
      const updatedUser = await this.userService.updateUserById(new mongoose.Schema.Types.ObjectId(id), update);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
  };

  deleteUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const success = await this.userService.deleteUserById(new mongoose.Schema.Types.ObjectId(id));
      if (!success) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
    }
  };
}