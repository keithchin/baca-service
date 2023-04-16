import express, { Request, Response, NextFunction, RequestHandler } from "express";
import { SubforumSubController } from "../services/SubforumSub/SubforumSubController";
import { SubforumSubService } from "../services/SubforumSub/SubforumSubService";
import { SubforumService } from "../services/Subforum/SubforumService";
import { UserService } from "../services/User/UserService";

export const subforumSubRoutes = express.Router();

const userService = new UserService();
const subforumService = new SubforumService();
const subforumSubService = new SubforumSubService(userService, subforumService);
const subforumSubController = new SubforumSubController(subforumSubService, userService, subforumService);

const asyncHandler = (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

subforumSubRoutes.post(
  "/subscribe/:subforumId",
  asyncHandler(subforumSubController.subscribeToSubforum)
);
subforumSubRoutes.post(
  "/unsubscribe/:subforumId",
  asyncHandler(subforumSubController.unsubscribeFromSubforum)
);
subforumSubRoutes.get(
  "/user/:userId/subscriptions",
  asyncHandler(subforumSubController.getSubscribedSubforums)
);
subforumSubRoutes.get(
  "/:subforumId/subscribers",
  asyncHandler(subforumSubController.getSubscribers)
);





