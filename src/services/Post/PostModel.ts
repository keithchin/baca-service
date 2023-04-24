import mongoose, { Schema, Model, Types } from 'mongoose';
import { IPost } from '@src/interfaces/Post/IPost';

const PostSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: Types.ObjectId, ref: 'User', required: true },
  subforumId: { type: Types.ObjectId, ref: 'Subforum', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  upvotedBy: [{ type: Types.ObjectId, ref: 'User' }],
  downvotedBy: [{ type: Types.ObjectId, ref: 'User' }],
  voteScore: { type: Number, default: 0 },
});

const PostModel: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);

export default PostModel;