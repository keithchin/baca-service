import { IUser } from "./IUser";
import { ObjectId } from "mongoose";
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: String): Promise<IUser | null>;
  createUser(createUpdateUserDto: CreateUpdateUserDto): Promise<IUser>;
  updateUserById(userId: String, update: Partial<IUser>): Promise<IUser | null>;
  deleteUserById(userId: String): Promise<boolean>;
  getUserByUsernameOrEmail(usernameOrEmail: String): Promise<IUser | null>;
  removeAll(): Promise<void>;
}