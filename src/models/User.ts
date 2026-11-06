import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'student' | 'company' | 'poster';
  college?: string;
  company?: string;
  bio?: string;
  skills: string[];
  avatar?: string;
  isEmailVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  createdAt: Date;
  updatedAt?: Date;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [EMAIL_REGEX, 'Please provide a valid email address'],
    },
    password: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'company', 'poster'],
      required: true,
      default: 'student',
    },
    college: { type: String, default: '', trim: true },
    company: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true },
    skills: { type: [String], default: [] },
    avatar: { type: String, default: '' },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
      index: true,
    },
    verificationTokenExpires: {
      type: Date,
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
