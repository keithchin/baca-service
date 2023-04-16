import { ISubforumSub } from "./ISubforumSub";
import { ObjectId } from "mongoose";
import CreateSubforumSubDto from "@src/dto/SubforumSub/CreateSubforumSubDto";

export interface ISubforumSubService {
  subscribeToSubforum(userId: ObjectId, subforumId: ObjectId): Promise<ISubforumSub>;
  unsubscribeFromSubforum(userId: ObjectId, subforumId: ObjectId): Promise<boolean>;
  getSubscribedSubforums(userId: ObjectId): Promise<ISubforumSub[]>;
  getSubscribers(subforumId: ObjectId): Promise<ISubforumSub[]>;
}