import { MongoMemoryServer } from 'mongodb-memory-server';
import { v4 as uuidv4 } from 'uuid';
import { connect, disconnect } from '../config/db';
import { UserService } from '../services/User/UserService';
import { SubforumService } from '../services/Subforum/SubforumService';
import { SubforumSubService } from '../services/SubforumSub/SubforumSubService';
import { ISubforum } from '@src/interfaces/Subforum/ISubforum';
import { ISubforumSub } from '@src/interfaces/SubforumSubs/ISubforumSub';
import { ISubforumSubService } from '@src/interfaces/SubforumSubs/ISubforumSubService';
import { IUser } from '@src/interfaces/User/IUser';
import { IUserService } from '@src/interfaces/User/IUserService';
import { ISubforumService } from '@src/interfaces/Subforum/ISubforumService';

let mongoServer: MongoMemoryServer;
let userService: IUserService;
let subforumService: ISubforumService;


let subforumSubService: ISubforumSubService;
let user: IUser;
let subforum: ISubforum;
let subscription: ISubforumSub;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'testdb'
    }
  });
  const uri = mongoServer.getUri();
  await connect(uri);

  userService = new UserService();
  subforumService = new SubforumService();
  subforumSubService = new SubforumSubService(userService, subforumService);
});

beforeEach(async () => {
  await Promise.all([
    userService.removeAll(),
    subforumService.removeAll(),
    subforumSubService.removeAll(),
  ]);

  user = await userService.createUser({
    username: `testUser_${uuidv4()}`,
    password: 'testPassword',
    password_confirmation: 'testPassword',
    email: 'test@nomail.com'
  });
  subforum = await subforumService.createSubforum({
    title: 'Test Subforum',
    description: 'A subforum for testing purposes',
    createdBy: user.id
  });
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});

describe('SubforumSubService', () => {
  

  
    test('should subscribe user to a subforum successfully', async () => {
      // Subscribe user to subforum
      subscription = await subforumSubService.subscribeToSubforum(user.id, subforum.id);
  
      // Validate subscription data
      expect(subscription.userId.toString()).toEqual(user.id.toString());
      expect(subscription.subforumId.toString()).toEqual(subforum.id.toString());
    });
  
    test('should throw an error when user is already subscribed to subforum', async () => {
      // Subscribe user to subforum
      await subforumSubService.subscribeToSubforum(user.id, subforum.id);
  
      // Attempt to subscribe user to subforum again
      try {
        await subforumSubService.subscribeToSubforum(user.id, subforum.id);
      } catch (error) {
        expect((error as Error).message).toEqual('User already subscribed to this subforum.');
      }
    });
  
    test('should unsubscribe user from a subforum successfully', async () => {
      // Subscribe user to subforum
      subscription = await subforumSubService.subscribeToSubforum(user.id, subforum.id);
  
      // Unsubscribe user from subforum
      const result = await subforumSubService.unsubscribeFromSubforum(user.id, subforum.id);
  
      // Validate result
      expect(result).toEqual(true);
    });
  
    test('should throw an error when user is not subscribed to subforum', async () => {
      // Attempt to unsubscribe user from subforum
      try {
        await subforumSubService.unsubscribeFromSubforum(user.id, subforum.id);
      } catch (error) {
        expect((error as Error).message).toEqual('User is not subscribed to this subforum.');
      }
    });
});  