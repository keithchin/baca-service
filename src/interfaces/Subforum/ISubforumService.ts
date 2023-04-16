import { ISubforum } from "./ISubforum";
import CreateSubforumDto from "@src/dto/Subforum/CreateSubforumDto";

export interface ISubforumService {
  getAllSubforums(): Promise<ISubforum[]>;
  getSubforumById(subforumId: string): Promise<ISubforum | null>;
  createSubforum(createSubforumDto: CreateSubforumDto): Promise<ISubforum>;
  updateSubforumById(subforumId: string, update: Partial<ISubforum>): Promise<ISubforum | null>;
  deleteSubforumById(subforumId: string): Promise<boolean>;
}