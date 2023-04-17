import { Model, ObjectId } from 'mongoose'
import { ISubforum } from '@src/interfaces/Subforum/ISubforum';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import subforumModel from './SubforumModel';

const SubforumModel: Model<ISubforum> = subforumModel;
import CreateSubforumDto from "@src/dto/Subforum/CreateSubforumDto";
import UpdateSubforumDto from "@src/dto/Subforum/UpdateSubforumDto";

export class SubforumService implements ISubforumService {

  public async getAllSubforums(): Promise<ISubforum[]> {
    try {
      const subforums = await SubforumModel.find({});
      return subforums;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async createSubforum(createSubforumDto: CreateSubforumDto): Promise<ISubforum> {
    try {
      const subforum = new SubforumModel(createSubforumDto);
      await subforum.save();
      return subforum;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async getSubforumById(id: ObjectId): Promise<ISubforum | null> {
    try {
      const subforum = await SubforumModel.findById(id);
      return subforum;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async updateSubforumById(
    id: ObjectId,
    updateSubforumDto: UpdateSubforumDto
  ): Promise<ISubforum | null> {
    try {
      const subforum = await SubforumModel.findByIdAndUpdate(id, updateSubforumDto, {
        new: true,
        runValidators: true,
      });
      return subforum;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  public async deleteSubforumById(id: ObjectId): Promise<boolean> {
    try {
      const result = await SubforumModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
  
  public async removeAll(): Promise<void> {
    try {
      await SubforumModel.deleteMany({});
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}