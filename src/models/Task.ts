import mongoose, { Schema, Document, Model } from 'mongoose';

export type TaskDuration = '1 day' | '3 days' | '1 week' | '2 weeks';
export type TaskStatus = 'open' | 'in-progress' | 'completed' | 'closed';

export interface ITask extends Document {
  title: string;
  description: string;
  acceptanceCriteria: string[];
  skillsRequired: string[];
  duration: TaskDuration;
  stipendOrPerks: string;
  posterId: string;
  posterName: string;
  companyName: string;
  creatorId?: string;
  creatorEmail?: string;
  difficulty?: string;
  status: TaskStatus;
  reward?: string;
  createdAt: Date;
  updatedAt?: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [120, 'Task title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
    },
    acceptanceCriteria: {
      type: [String],
      default: [],
    },
    skillsRequired: {
      type: [String],
      required: [true, 'Skills required are required'],
      default: [],
    },
    duration: {
      type: String,
      enum: ['1 day', '3 days', '1 week', '2 weeks'],
      default: '3 days',
    },
    stipendOrPerks: {
      type: String,
      default: 'Verified Skill Badge',
    },
    posterId: {
      type: String,
      required: [true, 'Poster ID is required'],
    },
    posterName: {
      type: String,
      required: [true, 'Poster name is required'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
    },
    creatorId: {
      type: String,
      trim: true,
    },
    creatorEmail: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'closed'],
      default: 'open',
    },
    reward: {
      type: String,
      default: 'Verified Skill Badge',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Backward compatibility middleware: Keep reward and stipendOrPerks synced
TaskSchema.pre('save', function (next) {
  if (!this.reward && this.stipendOrPerks) {
    this.reward = this.stipendOrPerks;
  } else if (!this.stipendOrPerks && this.reward) {
    this.stipendOrPerks = this.reward;
  }
  next();
});

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export default Task;
