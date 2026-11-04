import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  title: string;
  skill: string;
  taskId: string;
  studentId: string;
  issuerId: string;
  issuedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    title: { type: String, required: true },
    skill: { type: String, required: true },
    taskId: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    issuerId: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Badge: Model<IBadge> =
  mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
