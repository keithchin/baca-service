import mongoose, { Model, Schema } from 'mongoose';
import { IUser } from '@src/interfaces/User/IUser';

const userSchema : Schema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;