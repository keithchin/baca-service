import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser } from '@src/interfaces/User/IUser';
import { IUserService } from "@src/interfaces/User/IUserService";
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

export class UserController {
  constructor(private readonly userService: IUserService) {
    console.log('userService:', userService);
  }

  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users");
    }
  };

  public getUserById = async (req: Request, res: Response) => {
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

  public createUser = async (req: Request, res: Response) => {
    try {
      const createUserDto: CreateUpdateUserDto = req.body;
      const existingUserByEmail = await this.userService.getUserByUsernameOrEmail(createUserDto.email);
      if (existingUserByEmail) {
        return res.status(400).send("Email already in use");
      }
      const existingUserByUsername = await this.userService.getUserByUsernameOrEmail(createUserDto.username);
      if (existingUserByUsername) {
        return res.status(400).send("Username already in use");
      }
  
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
  
      const user = await this.userService.createUser({
        ...createUserDto,
        password: hashedPassword
      });
  
      res.status(201).json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating user");
    }
  };  
  
  public async authenticateUser(usernameOrEmail: string, password: string): Promise<IUser | null> {
    // Retrieve the user's record from the database using their username/email
    const user = await this.userService.getUserByUsernameOrEmail(usernameOrEmail);
  
    if (user) {
      // Use bcrypt to compare the password entered by the user with the password hash stored in the database
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      if (passwordMatch) {
        // Return the user's record, indicating that the authentication was successful
        return user;
      }
    }
  
    // If the authentication failed, return null
    return null;
  }
  
  
  
  
  public updateUserById = async (req: Request, res: Response) => {
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

  public deleteUserById = async (req: Request, res: Response) => {
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