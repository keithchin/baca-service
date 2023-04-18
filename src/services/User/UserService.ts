import { Model, ObjectId } from 'mongoose'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { IUser } from '../../interfaces/User/IUser';
import { IUserService } from '../../interfaces/User/IUserService';
import userModel from './UserModel';
import CreateUpdateUserDto from "@src/dto/User/CreateUpdateUserDto";

const UserModel: Model<IUser> = userModel;


export class UserService implements IUserService {

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private signJwt(userId: ObjectId): string {
    const secretKey = process.env.JWT_SECRET || 'bluebanana';
    return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
  }

  public async getAllUsers(): Promise<IUser[]> {
      console.log('hi');
      try {
        const users = await UserModel.find();
        return users;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }

    public async getUserByUsernameOrEmail(usernameOrEmail: string): Promise<IUser | null> {
      try {
        const user = await UserModel.findOne({
          $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
    

    public async getUserById(userId: ObjectId): Promise<IUser | null> {
      try {
        const user = await UserModel.findById(userId);
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    public async createUser(createUserDto: CreateUpdateUserDto): Promise<IUser> {
      try {
        const hashedPassword = await this.hashPassword(createUserDto.password);
        const user = new UserModel({ ...createUserDto, password: hashedPassword });
        await user.save();
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }

    public async authenticateUser(usernameOrEmail: string, password: string): Promise<string | null> {
      const user = await this.getUserByUsernameOrEmail(usernameOrEmail);
    
      if (!user) {
        return null;
      }
    
      const isPasswordValid = await this.verifyPassword(password, user.password);
    
      if (!isPasswordValid) {
        return null;
      }
    
      return this.signJwt(user._id);
    }
    
    public async updateUserById(userId: ObjectId, updateUserDto: CreateUpdateUserDto): Promise<IUser | null> {
      try {
        const user = await UserModel.findByIdAndUpdate(userId, updateUserDto, { new: true });
        return user;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  
    public async deleteUserById(userId: ObjectId): Promise<boolean> {
      try {
        const result = await UserModel.findByIdAndDelete(userId);
        return result !== null;
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }

    public async removeAll(): Promise<void> {
      try {
        await UserModel.deleteMany({});
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  }