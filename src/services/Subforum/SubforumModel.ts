import mongoose, { Model } from 'mongoose';
import { ISubforum } from '@src/interfaces/Subforum/ISubforum'
   

const SubforumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const SubforumModel: Model<ISubforum> = mongoose.model<ISubforum>('Subforum', SubforumSchema);

export default SubforumModel;