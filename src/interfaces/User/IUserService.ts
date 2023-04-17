import { IUser } from "./IUser";
import { ObjectId } from "mongoose";
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: ObjectId): Promise<IUser | null>;
  createUser(createUpdateUserDto: CreateUpdateUserDto): Promise<IUser>;
  updateUserById(userId: ObjectId, update: Partial<IUser>): Promise<IUser | null>;
  deleteUserById(userId: ObjectId): Promise<boolean>;
  getUserByUsernameOrEmail(usernameOrEmail: string): Promise<IUser | null>;
  removeAll(): Promise<void>;
}