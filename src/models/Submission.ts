import mongoose, { Schema, Document, Model } from 'mongoose';

export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface ISubmission extends Document {
  taskId: string;
  studentId: string;
  studentName?: string;
  proofUrl: string;
  notes: string;
  status: SubmissionStatus;
  feedback?: string;
  createdAt: Date;
  reviewedAt?: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    taskId: { type: String, required: true, index: true },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String },
    proofUrl: { type: String, required: true },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    feedback: { type: String, default: '' },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission ||
  mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission;
