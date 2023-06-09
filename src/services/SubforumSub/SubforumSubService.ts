import { Model, ObjectId } from 'mongoose';
import { ISubforumSub } from '@src/interfaces/SubforumSubs/ISubforumSub';
import { ISubforumSubService } from '@src/interfaces/SubforumSubs/ISubforumSubService';
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';
import subforumSubModel from './SubforumSubModel';

const SubforumSubModel: Model<ISubforumSub> = subforumSubModel;

export class SubforumSubService implements ISubforumSubService {
    constructor(
        private readonly userService: IUserService,
        private readonly subforumService: ISubforumService
    ) {}
    

  public async subscribeToSubforum(
    userId: String,
    subforumId: String
  ): Promise<ISubforumSub> {
    const user = await this.userService.getUserById(userId);
    const subforum = await this.subforumService.getSubforumById(subforumId);
  
    if (!user) {
      throw new Error('User not found');
    }
  
    if (!subforum) {
      throw new Error('Subforum not found');
    }
  
    const existingSubscription = await SubforumSubModel.findOne({
      userId,
      subforumId,
    });
  
    if (existingSubscription) {
      throw new Error('User already subscribed to this subforum.');
    }
  
    const subscription = new SubforumSubModel({
      userId,
      subforumId,
    });
  
    await subscription.save();
    return subscription;
  }

  public async unsubscribeFromSubforum(
    userId: String,
    subforumId: String
  ): Promise<boolean> {
    const existingSubscription = await SubforumSubModel.findOne({
      userId,
      subforumId,
    });
  
    if (!existingSubscription) {
      throw new Error("User is not subscribed to this subforum.");
    }
  
    const result = await SubforumSubModel.deleteOne({ userId, subforumId });
    return result.deletedCount === 1;
  } 
  
  public async getSubscribedSubforums(userId: String): Promise<ISubforumSub[]> {
    const subscriptions = await SubforumSubModel.find({ userId });
    return subscriptions;
  }

  public async getSubscribers(subforumId: String): Promise<ISubforumSub[]> {
    const subscribers = await SubforumSubModel.find({ subforumId });
    return subscribers;
  }

  public async removeAll(): Promise<void> {
    try {
      await SubforumSubModel.deleteMany({});
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}