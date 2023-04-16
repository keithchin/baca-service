import mongoose, { Model } from 'mongoose';
import { ISubforumSub } from '@src/interfaces/SubforumSubs/ISubforumSub';

const SubforumSubSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subforumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subforum',
      required: true,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false } },
);

const SubforumSubModel: Model<ISubforumSub> = mongoose.model<ISubforumSub>('SubforumSub', SubforumSubSchema);

export default SubforumSubModel;