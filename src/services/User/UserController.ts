import { Request, Response } from "express";
import { IUserService } from "@src/interfaces/User/IUserService";
import CreateUpdateUserDto from "../../dto/User/CreateUpdateUserDto";

export class UserController {
  constructor(private readonly userService: IUserService) {}

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      if (!user) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving user");
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const createUserDto: CreateUpdateUserDto = req.body;
      const user = await this.userService.createUser(createUserDto);
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating user");
    }
  }

  async updateUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const update = req.body;
      const updatedUser = await this.userService.updateUserById(id, update);
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating user");
    }
  }

  async deleteUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const success = await this.userService.deleteUserById(id);
      if (!success) {
        return res.status(404).send("User not found");
      }
      res.status(200).send("User deleted successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error deleting user");
    }
  }
}