import { Document, ObjectId } from 'mongoose';

export interface ISubforumSub extends Document {
  userId: ObjectId; // User who is subscribing to the subforum
  subforumId: ObjectId; // Subforum the user is subscribing to
  createdAt: Date; // Date when the subscription was created
}