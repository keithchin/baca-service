import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserService } from '../services/User/UserService';
import { SubforumService } from '../services/Subforum/SubforumService';
import { PostService } from '../services/Post/PostService';
import { IUser } from '@src/interfaces/User/IUser';
import { ISubforum } from '@src/interfaces/Subforum/ISubforum';
import { connect, disconnect } from '../config/db';

let mongoServer: MongoMemoryServer;
let userService: UserService;
let subforumService: SubforumService;
let postService: PostService;

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
    postService = new PostService(userService, subforumService);
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});

describe('PostService', () => {
    let user: IUser;
    let subforum: ISubforum;
  
    beforeAll(async () => {
      // Create a user and subforum for testing purposes
      user = await userService.createUser({ username: 'testUser', password: 'testPassword', password_confirmation: 'testPassword', email: 'test@nomail.com' });
      subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id,
      });
    });
  
    test('should create a post successfully', async () => {
      // Create a post
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        authorId: user.id,
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
  
      // Validate post data
      expect(post.title).toEqual(createPostDto.title);
      expect(post.content).toEqual(createPostDto.content);
      expect(post.authorId.toString()).toEqual(createPostDto.authorId);
      expect(post.subforumId.toString()).toEqual(createPostDto.subforumId);
    });
  
    test('should get all posts successfully', async () => {
      // Create two posts
      const createPostDto1 = {
        title: 'Test Post 1',
        content: 'This is test post 1',
        authorId: user.id,
        subforumId: subforum.id,
      };
      const post1 = await postService.createPost(createPostDto1);
  
      const createPostDto2 = {
        title: 'Test Post 2',
        content: 'This is test post 2',
        authorId: user.id,
        subforumId: subforum.id,
      };
      const post2 = await postService.createPost(createPostDto2);
  
      // Get all posts
      const posts = await postService.getAllPosts();
  
      // Validate the length and contents of the array
      expect(posts.length).toEqual(2);
      expect(posts[0].title).toEqual(post1.title);
      expect(posts[1].title).toEqual(post2.title);
    });
  
    test('should get a post by ID successfully', async () => {
      // Create a post
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        authorId: user.id,
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
  
      // Get the post by ID
      const foundPost = await postService.getPostById(post.id);
  
      // Validate post data
      expect(foundPost?.title).toEqual(post.title);
      expect(foundPost?.content).toEqual(post.content);
      expect(foundPost?.authorId.toString()).toEqual(post.authorId.toString());
      expect(foundPost?.subforumId.toString()).toEqual(post.subforumId.toString());
    });
  
    test('should retrieve all posts', async () => {
        // Create some test data
        const user = await userService.createUser({ username: 'testUser', password: 'testPassword', password_confirmation: 'testPassword', email: 'test@nomail.com' });
        const subforum = await subforumService.createSubforum({
            title: 'Test Subforum',
            description: 'A subforum for testing purposes',
            createdBy: user.id,
        });
        const createPostDto1 = {
            title: 'Test Post 1',
            content: 'This is a test post 1',
            authorId: user.id,
            subforumId: subforum.id,
        };
        const createPostDto2 = {
            title: 'Test Post 2',
            content: 'This is a test post 2',
            authorId: user.id,
            subforumId: subforum.id,
        };
        await postService.createPost(createPostDto1);
        await postService.createPost(createPostDto2);
        
        // Retrieve all posts
        const posts = await postService.getAllPosts();
        
        // Validate the retrieved posts
        expect(posts.length).toBe(2);
        expect(posts[0].title).toEqual(createPostDto1.title);
        expect(posts[1].title).toEqual(createPostDto2.title);
    });
      
    test('should retrieve a post by ID', async () => {
    // Create some test data
        const user = await userService.createUser({ username: 'testUser', password: 'testPassword', password_confirmation: 'testPassword', email: 'test@nomail.com' });
        const subforum = await subforumService.createSubforum({
            title: 'Test Subforum',
            description: 'A subforum for testing purposes',
            createdBy: user.id,
        });
        const createPostDto = {
            title: 'Test Post',
            content: 'This is a test post',
            authorId: user.id,
            subforumId: subforum.id,
        };
        const post = await postService.createPost(createPostDto);
        
        // Retrieve the post by ID
        const retrievedPost = await postService.getPostById(post.id);
        
        // Validate the retrieved post
        expect(retrievedPost?.title).toEqual(createPostDto.title);
        expect(retrievedPost?.content).toEqual(createPostDto.content);
        expect(retrievedPost?.authorId.toString()).toEqual(createPostDto.authorId);
        expect(retrievedPost?.subforumId.toString()).toEqual(createPostDto.subforumId);
    });
});
  