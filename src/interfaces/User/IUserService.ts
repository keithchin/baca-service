import { IUser } from "./IUser";
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

export interface IUserService {
  getAllUsers(): Promise<IUser[]>;
  getUserById(userId: string): Promise<IUser | null>;
  createUser(createUpdateUserDto: CreateUpdateUserDto): Promise<IUser>;
  updateUserById(userId: string, update: Partial<IUser>): Promise<IUser | null>;
  deleteUserById(userId: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<IUser | null>;

}