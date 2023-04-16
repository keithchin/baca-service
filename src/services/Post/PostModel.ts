import mongoose, { Schema, Model } from 'mongoose';
import { IPost } from '@src/interfaces/Post/IPost';

const PostSchema: Schema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subforumId: { type: Schema.Types.ObjectId, ref: 'Subforum', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });
  
  const PostModel: Model<IPost> = mongoose.model<IPost>('Post', PostSchema);

  export default PostModel;