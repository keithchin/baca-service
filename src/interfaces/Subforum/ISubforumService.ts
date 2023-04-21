  import { ISubforum } from "./ISubforum";
  import { ObjectId } from "mongoose";
  import CreateSubforumDto from "@src/dto/Subforum/CreateSubforumDto";

  export interface ISubforumService {
    getAllSubforums(): Promise<ISubforum[]>;
    getSubforumById(subforumId: String): Promise<ISubforum | null>;
    createSubforum(createSubforumDto: CreateSubforumDto): Promise<ISubforum>;
    updateSubforumById(subforumId: String, update: Partial<ISubforum>): Promise<ISubforum | null>;
    deleteSubforumById(subforumId: String): Promise<boolean>;
    removeAll(): Promise<void>;
  }