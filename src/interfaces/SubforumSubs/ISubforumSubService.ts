import { ISubforumSub } from "./ISubforumSub";
import CreateSubforumSubDto from "@src/dto/SubforumSub/CreateSubforumSubDto";

export interface ISubforumSubService {
  subscribeToSubforum(userId: string, subforumId: string): Promise<ISubforumSub>;
  unsubscribeFromSubforum(userId: string, subforumId: string): Promise<boolean>;
  getSubscribedSubforums(userId: string): Promise<ISubforumSub[]>;
  getSubscribers(subforumId: string): Promise<ISubforumSub[]>;
}