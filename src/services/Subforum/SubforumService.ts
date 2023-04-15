import { Model } from 'mongoose'
import { ISubforum } from '@src/interfaces/Subforum/ISubforum';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import subforumModel from '../../models/SubforumModel';

const SubforumModel: Model<ISubforum> = subforumModel;
import CreateSubforumDto from "../../dto/Subforum/CreateSubforumDto";
import UpdateSubforumDto from "../../dto/Subforum/UpdateSubforumDto";

export class SubforumService implements ISubforumService {
  async getAllSubforums(): Promise<ISubforum[]> {
    try {
      const subforums = await SubforumModel.find({});
      return subforums;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createSubforum(createSubforumDto: CreateSubforumDto): Promise<ISubforum> {
    try {
      const subforum = new SubforumModel(createSubforumDto);
      await subforum.save();
      return subforum;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getSubforumById(id: string): Promise<ISubforum | null> {
    try {
      const subforum = await SubforumModel.findById(id);
      return subforum;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateSubforumById(
    id: string,
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

  async deleteSubforumById(id: string): Promise<boolean> {
    try {
      const result = await SubforumModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}