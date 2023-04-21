import { Document, ObjectId, Types } from 'mongoose';

export  interface IPost extends Document {
    title: string;
    content: string;  
    author: Types.ObjectId;
    subforumId: Types.ObjectId;
    upvotes: ObjectId[];
    downvotes: ObjectId[];
    created_at: Date;
    updated_at: Date;
    upvotedBy?: ObjectId[];
    downvotedBy?: ObjectId[];
    voteScore: number; 
}