import { Model, ObjectId } from 'mongoose'
import { IUser } from '../../interfaces/User/IUser';
import { IUserService } from '../../interfaces/User/IUserService';
import userModel from './UserModel';
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

const UserModel: Model<IUser> = userModel;


export class UserService implements IUserService {
    async getAllUsers(): Promise<IUser[]> {
      console.log('hi');
      try {
        const users = await UserModel.find();
        return users;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    public async getUserByUsername(username: string): Promise<IUser | null> {
      try {
        const user = await UserModel.findOne({ username });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }

    async getUserById(userId: ObjectId): Promise<IUser | null> {
      try {
        const user = await UserModel.findById(userId);
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    async createUser(createUserDto: CreateUpdateUserDto): Promise<IUser> {
        try {
          const user = new UserModel(createUserDto);
          await user.save();
          return user;
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
  
    async updateUserById(userId: ObjectId, updateUserDto: CreateUpdateUserDto): Promise<IUser | null> {
      try {
        const user = await UserModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    async deleteUserById(userId: ObjectId): Promise<boolean> {
      try {
        const result = await UserModel.findByIdAndDelete(userId);
        return result !== null;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
      try {
        const user = await UserModel.findOne({ email });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  }