import { ObjectId } from 'mongoose';

export default interface CreatePostDto {
    content: String;
    authorId: String;
    subforumId: String;
  }