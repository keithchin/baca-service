import { MongoMemoryServer } from 'mongodb-memory-server';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../services/User/UserService';
import { IUser } from '@src/interfaces/User/IUser';
import { connect, disconnect } from '../config/db';

let mongoServer: MongoMemoryServer;
let userService: UserService;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'testdb'
    }
  });
  const uri = mongoServer.getUri();
  await connect(uri);

  userService = new UserService();
});

beforeEach(async () => {
  await userService.removeAll();
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});

describe('UserService', () => {
    test('should create a user successfully', async () => {
      const createUserDto = {
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: 'test@nomail.com'
      };
      const user = await userService.createUser(createUserDto);
  
      // Validate user data
      expect(user.username).toEqual(createUserDto.username);
      expect(user.email).toEqual(createUserDto.email);
    });
  
    test('should get all users successfully', async () => {
      // Create two users
      const createUserDto1 = {
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      };
      const user1 = await userService.createUser(createUserDto1);
  
      const createUserDto2 = {
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      };
      const user2 = await userService.createUser(createUserDto2);
  
      // Get all users
      const users = await userService.getAllUsers();
  
      // Validate the length and contents of the array
      expect(users.length).toEqual(2);
      expect(users[0].username).toEqual(user1.username);
      expect(users[1].username).toEqual(user2.username);
    });
  
    test('should get a user by ID successfully', async () => {
      const createUserDto = {
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      };
      const user = await userService.createUser(createUserDto);
  
      // Get the user by ID
      const foundUser = await userService.getUserById(user.id);
  
      // Validate user data
      expect(foundUser?.username).toEqual(user.username);
      expect(foundUser?.email).toEqual(user.email);
    });
  
    test('should get a user by username or email successfully', async () => {
      const createUserDto = {
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      };
      const user = await userService.createUser(createUserDto);
  
      // Get the user by username or email
      const foundUser1 = await userService.getUserByUsernameOrEmail(user.username);
      const foundUser2 = await userService.getUserByUsernameOrEmail(user.email);
  
      // Validate user data
      expect(foundUser1?.username).toEqual(user.username);
      expect(foundUser2?.email).toEqual(user.email);
    });
});