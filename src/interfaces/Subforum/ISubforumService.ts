  import { ISubforum } from "./ISubforum";
  import { ObjectId } from "mongoose";
  import CreateSubforumDto from "@src/dto/Subforum/CreateSubforumDto";

  export interface ISubforumService {
    getAllSubforums(): Promise<ISubforum[]>;
    getSubforumById(subforumId: ObjectId): Promise<ISubforum | null>;
    createSubforum(createSubforumDto: CreateSubforumDto): Promise<ISubforum>;
    updateSubforumById(subforumId: ObjectId, update: Partial<ISubforum>): Promise<ISubforum | null>;
    deleteSubforumById(subforumId: ObjectId): Promise<boolean>;
    removeAll(): Promise<void>;
  }