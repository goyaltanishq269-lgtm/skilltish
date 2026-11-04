import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBadge extends Document {
  title: string;
  skill: string;
  taskId: string;
  studentId: string;
  studentName?: string;
  issuerId: string;
  issuerName?: string;
  companyName?: string;
  proofUrl?: string;
  issuedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    title: { type: String, required: true },
    skill: { type: String, required: true },
    taskId: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String },
    issuerId: { type: String, required: true },
    issuerName: { type: String },
    companyName: { type: String },
    proofUrl: { type: String },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Badge: Model<IBadge> =
  mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);

export default Badge;
