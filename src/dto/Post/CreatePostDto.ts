import { ObjectId } from 'mongoose';

export default interface CreatePostDto {
    title: String;
    content: String;
    author: {
      _id: String,
    };
    subforumId: String;
  }