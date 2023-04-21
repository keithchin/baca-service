import { ObjectId } from 'mongoose';

export default interface CreatePostDto {
    title: String;
    content: String;
    authorId: String;
    subforumId: String;
  }