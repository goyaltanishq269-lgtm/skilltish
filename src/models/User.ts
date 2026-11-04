import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  role: 'student' | 'company' | 'poster';
  college?: string;
  company?: string;
  bio?: string;
  skills: string[];
  avatar?: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ['student', 'company', 'poster'],
      required: true,
      default: 'student',
    },
    college: { type: String, default: '' },
    company: { type: String, default: '' },
    bio: { type: String, default: '' },
    skills: { type: [String], default: [] },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
