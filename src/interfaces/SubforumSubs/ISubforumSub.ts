import { Document } from 'mongoose';

export interface ISubforumSub extends Document {
  userId: string; // User who is subscribing to the subforum
  subforumId: string; // Subforum the user is subscribing to
  createdAt: Date; // Date when the subscription was created
}