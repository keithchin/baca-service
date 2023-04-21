import { Request, Response } from "express";
import mongoose,  { ObjectId } from "mongoose";
import { ISubforumSubService } from "@src/interfaces/SubforumSubs/ISubforumSubService";
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';

import CreateSubforumSubDTO from "@src/dto/SubforumSub/CreateSubforumSubDto";

export class SubforumSubController {
    constructor(
        private readonly subforumSubService: ISubforumSubService,
        private readonly userService: IUserService,
        private readonly subforumService: ISubforumService
      ) {}

  
  subscribeToSubforum = async (req: Request, res: Response) => {
    try {
      const { userId, subforumId } = req.body;
      console.log('User ID: ' + userId);
      console.log('Subforum ID: ' + subforumId);
      const subscription = await this.subforumSubService.subscribeToSubforum(userId, subforumId);
      res.status(201).json(subscription);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === 'User not found' || error.message === 'Subforum not found') {
          res.status(404).send(error.message);
        } else if (error.message === 'User already subscribed to this subforum.') {
          res.status(400).send(error.message);
        } else {
          res.status(500).send('Error subscribing user to subforum');
        }
      } else {
        res.status(500).send('Unexpected error occurred');
      }
    }
  };

  unsubscribeFromSubforum = async (req: Request, res: Response) => {
    try {
      const { userId, subforumId } = req.body;
      const subscription = await this.subforumSubService.unsubscribeFromSubforum(userId, subforumId);
      res.status(200).json(subscription);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        if (error.message === 'User is not subscribed to this subforum.') {
          res.status(404).send(error.message);
        } else {
          res.status(500).send('Error unsubscribing user from subforum');
        }
      } else {
        res.status(500).send('Unexpected error occurred');
      }
    }
  };

  isValidObjectId = (value: string): boolean => {
    return /^[a-f\d]{24}$/i.test(value);
  }

  getSubscribedSubforums = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      console.log("User ID:", userId);

      if (!this.isValidObjectId(userId)) {
        return res.status(400).send("Invalid user ID");
      }
      const subscriptions = await this.subforumSubService.getSubscribedSubforums(userId);
      res.status(200).json(subscriptions);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting subscribed subforums");
    }
  }

  getSubscribers = async (req: Request, res: Response) => {
    try {
      const { subforumId } = req.params;
      const subscribers = await this.subforumSubService.getSubscribers(subforumId);
      res.status(200).json(subscribers);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error getting subforum subscribers");
    }
  }
}