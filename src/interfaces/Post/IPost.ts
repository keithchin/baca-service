import { Document, ObjectId } from 'mongoose';

export  interface IPost extends Document {
    title: string;
    content: string;  
    authorId: ObjectId;
    subforumId: ObjectId;
    upvotes: ObjectId[];
    downvotes: ObjectId[];
    created_at: Date;
    updated_at: Date;
    upvotedBy?: ObjectId[];
    downvotedBy?: ObjectId[];
    voteScore: number; 
}