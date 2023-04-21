import { ISubforumSub } from "./ISubforumSub";
import { ObjectId } from "mongoose";
import CreateSubforumSubDto from "@src/dto/SubforumSub/CreateSubforumSubDto";

export interface ISubforumSubService {
  subscribeToSubforum(userId: String, subforumId: String): Promise<ISubforumSub>;
  unsubscribeFromSubforum(userId: String, subforumId: String): Promise<boolean>;
  getSubscribedSubforums(userId: String): Promise<ISubforumSub[]>;
  getSubscribers(subforumId: String): Promise<ISubforumSub[]>;
  removeAll(): Promise<void>;
}