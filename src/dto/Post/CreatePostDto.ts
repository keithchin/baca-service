import { ObjectId } from 'mongoose';

export default interface CreatePostDto {
    title: string;
    content: string;
    authorId: ObjectId;
    subforumId: ObjectId;
  }