import { MongoMemoryServer } from 'mongodb-memory-server';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../services/User/UserService';
import { SubforumService } from '../services/Subforum/SubforumService';
import { SubforumSubService } from '../services/SubforumSub/SubforumSubService';
import { PostService } from '../services/Post/PostService';
import { connect, disconnect } from '../config/db';

let mongoServer: MongoMemoryServer;
let userService: UserService;
let subforumService: SubforumService;
let subforumSubService: SubforumSubService;
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
  subforumSubService = new SubforumSubService(userService, subforumService);
  postService = new PostService(userService, subforumService);
});

beforeEach(async () => {
  await Promise.all([
    userService.removeAll(),
    subforumService.removeAll(),
    subforumSubService.removeAll(),
    postService.removeAll(),
  ]);
});

afterAll(async () => {
  await disconnect();
  await mongoServer.stop();
});


describe('PostService', () => {
  
  
    test('should create a post successfully', async () => {
    // Create a post
    const user = await userService.createUser({
      username: `testUser_${uuidv4()}`,
      password: 'testPassword',
      password_confirmation: 'testPassword',
      email: 'test@nomail.com'
    });
    const subforum = await subforumService.createSubforum({
      title: 'Test Subforum',
      description: 'A subforum for testing purposes',
      createdBy: user.id
    });
    const createPostDto = {
      title: 'Test Post',
      content: 'This is a test post',
      author: {
        _id: user.id
      },
      subforumId: subforum.id
    };
    const post = await postService.createPost(createPostDto);
  
      // Validate post data
      expect(post.title).toEqual(createPostDto.title);
      expect(post.content).toEqual(createPostDto.content);
      expect(post.authorId.toString()).toEqual(createPostDto.author._id);
      expect(post.subforumId.toString()).toEqual(createPostDto.subforumId);
    });
  
    test('should get all posts successfully', async () => {
      // Create two posts
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });

      
      const createPostDto1 = {
        title: 'Test Post 1',
        content: 'This is test post 1',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post1 = await postService.createPost(createPostDto1);
  
      const createPostDto2 = {
        title: 'Test Post 2',
        content: 'This is test post 2',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post2 = await postService.createPost(createPostDto2);
  
      // Get all posts
      const posts = await postService.getAllPosts();
      
      console.log(posts);

      // Validate the length and contents of the array
      expect(posts.length).toEqual(2);
      expect(posts[0].title).toEqual(post1.title);
      expect(posts[1].title).toEqual(post2.title);
    });
  
    test('should get a post by ID successfully', async () => {
      // Create a post
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
    
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
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

    test('should update a post successfully', async () => {
      // Create a post
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
    
      // Update the post
      const updatePostDto = {
        title: 'Updated Test Post',
        content: 'This is an updated test post',
      };
      const updatedPost = await postService.updatePostById(post.id, updatePostDto);
    
      // Validate updated post data
      expect(updatedPost?.title).toEqual(updatePostDto.title);
      expect(updatedPost?.content).toEqual(updatePostDto.content);
    });
    
    test('should delete a post successfully', async () => {
      // Create a post
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
    
      // Delete the post
      const deleteResult = await postService.deletePostById(post.id);
    
      // Validate delete result
      expect(deleteResult).toBeGreaterThan(0);
    });

    test('should not be able to upvote own post', async () => {
      // Create a post and user
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
    
      let error;
      try {
        // Upvote the post
        await postService.upvotePost(user.id, post.id);
      } catch (e) {
        error = e;
      }
    
      // Validate upvoted post data
      expect(error).toBeDefined();
      expect((error as Error).message).toEqual('Cannot upvote own post.');
    });

    test('should be able to upvote a post successfully', async () => {
      // Create a post and user
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);

      const upvotingUser = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
    
      // Upvote the post
      const upvotedPost = await postService.upvotePost(upvotingUser.id, post.id);
    
      // Get the updated post data from the database
      const updatedPost = await postService.getPostById(post.id);
    
      // Validate upvoted post data
      expect(upvotedPost?.voteScore).toEqual(updatedPost?.voteScore);
      expect(upvotedPost?.upvotedBy?.length).toEqual(1);
    });

    test('should downvote a post successfully', async () => {
      // Create a post and user
      const user = await userService.createUser({
        username: `testUser_${uuidv4()}`,
        password: 'testPassword',
        password_confirmation: 'testPassword',
        email: `test_${uuidv4()}@nomail.com`
      });
      const subforum = await subforumService.createSubforum({
        title: 'Test Subforum',
        description: 'A subforum for testing purposes',
        createdBy: user.id
      });
      const createPostDto = {
        title: 'Test Post',
        content: 'This is a test post',
        author: {
          _id: user.id
        },
        subforumId: subforum.id,
      };
      const post = await postService.createPost(createPostDto);
    
      // Downvote the post
      const downvotedPost = await postService.downvotePost(user.id, post.id);

      // Get the updated post data from the database
      const updatedPost = await postService.getPostById(post.id);

    
      // Validate downvoted post data
      expect(updatedPost?.voteScore).toEqual(downvotedPost?.voteScore);
      expect(downvotedPost?.upvotedBy?.length).toEqual(0);
      expect(downvotedPost?.downvotedBy?.length).toEqual(1);
      expect(downvotedPost?.downvotedBy && downvotedPost.downvotedBy[0].toString()).toEqual(user.id.toString());
    });
});
  