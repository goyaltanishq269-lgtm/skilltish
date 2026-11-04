import mongoose from 'mongoose';
import connectToDatabase from './mongodb';
import { User, Task, Submission, Badge } from '@/models';
import {
  INITIAL_USERS,
  INITIAL_TASKS,
  INITIAL_SUBMISSIONS,
  INITIAL_BADGES,
  MockUser,
  MockTask,
  MockSubmission,
  MockBadge,
} from './demo-data';

// In-memory runtime state (fallback if MongoDB is offline)
interface InMemoryStore {
  users: MockUser[];
  tasks: MockTask[];
  submissions: MockSubmission[];
  badges: MockBadge[];
  hasSeededMongo: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var memoryStore: InMemoryStore | undefined;
}

if (!global.memoryStore) {
  global.memoryStore = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    submissions: JSON.parse(JSON.stringify(INITIAL_SUBMISSIONS)),
    badges: JSON.parse(JSON.stringify(INITIAL_BADGES)),
    hasSeededMongo: false,
  };
}

const mem = global.memoryStore;

// Ensure MongoDB has the initial demo accounts and tasks
export async function ensureSeeded() {
  const { isConnected } = await connectToDatabase();
  if (!isConnected || mem.hasSeededMongo) return;

  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding demo data into MongoDB...');
      await User.insertMany(INITIAL_USERS);
      await Task.insertMany(INITIAL_TASKS);
      await Submission.insertMany(INITIAL_SUBMISSIONS);
      await Badge.insertMany(INITIAL_BADGES);
      console.log('MongoDB successfully seeded!');
    }
    mem.hasSeededMongo = true;
  } catch (err: any) {
    console.warn('Error checking/seeding MongoDB:', err.message);
  }
}

// User methods
export async function getUsers(): Promise<any[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    return await User.find({}).lean();
  }
  return mem.users;
}

export async function getUserByEmail(email: string): Promise<any | null> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    return user;
  }
  return mem.users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function getUserById(id: string): Promise<any | null> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    if (mongoose.Types.ObjectId.isValid(id)) {
      return await User.findById(id).lean();
    }
  }
  return mem.users.find((u) => u._id === id) || null;
}

// Task methods
export async function getTasks(filters?: { duration?: string; skill?: string; search?: string }): Promise<any[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const query: any = {};
    if (filters?.duration && filters.duration !== 'all') {
      query.duration = filters.duration;
    }
    if (filters?.skill && filters.skill !== 'all') {
      query.skillsRequired = { $in: [new RegExp(filters.skill, 'i')] };
    }
    if (filters?.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { companyName: { $regex: filters.search, $options: 'i' } },
      ];
    }
    const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
    return tasks.map((t: any) => ({
      ...t,
      companyName: t.companyName || (typeof t.posterId === 'object' ? t.posterId?.company : undefined) || 'DevStudio',
      posterName: t.posterName || (typeof t.posterId === 'object' ? t.posterId?.name : undefined) || 'Priya Sharma',
      stipendOrPerks: t.stipendOrPerks || t.reward || 'Verified Skill Badge',
      poster: {
        _id: typeof t.posterId === 'string' ? t.posterId : t.posterId?._id || 'company-1',
        name: t.posterName || t.posterId?.name || 'Priya Sharma',
        company: t.companyName || t.posterId?.company || 'DevStudio',
        email: t.posterId?.email || 'priya@devstudio.io',
      },
    }));
  }

  // Fallback memory
  let list = [...mem.tasks];
  if (filters?.duration && filters.duration !== 'all') {
    list = list.filter((t) => t.duration === filters.duration);
  }
  if (filters?.skill && filters.skill !== 'all') {
    list = list.filter((t) =>
      t.skillsRequired.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase()))
    );
  }
  if (filters?.search) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s) ||
        (t.companyName && t.companyName.toLowerCase().includes(s))
    );
  }

  return list.map((t: any) => {
    const poster = mem.users.find((u) => u._id === t.posterId);
    return {
      ...t,
      companyName: t.companyName || poster?.company || 'DevStudio',
      posterName: t.posterName || poster?.name || 'Priya Sharma',
      stipendOrPerks: t.stipendOrPerks || t.reward || 'Verified Skill Badge',
      acceptanceCriteria: t.acceptanceCriteria || [],
      poster: poster ? { _id: poster._id, name: poster.name, email: poster.email, company: poster.company } : {
        _id: t.posterId,
        name: t.posterName || 'Priya Sharma',
        company: t.companyName || 'DevStudio',
      },
    };
  });
}

export async function getTaskById(id: string): Promise<any | null> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    let task: any = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      task = await Task.findById(id).lean();
    } else {
      task = await Task.findOne({ _id: id }).lean();
    }
    if (task) {
      return {
        ...task,
        companyName: task.companyName || 'DevStudio',
        posterName: task.posterName || 'Priya Sharma',
        stipendOrPerks: task.stipendOrPerks || task.reward || 'Verified Skill Badge',
        acceptanceCriteria: task.acceptanceCriteria || [],
        poster: {
          _id: task.posterId,
          name: task.posterName || 'Priya Sharma',
          company: task.companyName || 'DevStudio',
        },
      };
    }
  }

  const t: any = mem.tasks.find((task) => task._id === id);
  if (!t) return null;
  const poster = mem.users.find((u) => u._id === t.posterId);
  return {
    ...t,
    companyName: t.companyName || poster?.company || 'DevStudio',
    posterName: t.posterName || poster?.name || 'Priya Sharma',
    stipendOrPerks: t.stipendOrPerks || t.reward || 'Verified Skill Badge',
    acceptanceCriteria: t.acceptanceCriteria || [],
    poster: poster ? { _id: poster._id, name: poster.name, email: poster.email, company: poster.company, bio: poster.bio, skills: poster.skills } : {
      _id: t.posterId,
      name: t.posterName || 'Priya Sharma',
      company: t.companyName || 'DevStudio',
    },
  };
}

export async function createTask(data: {
  title: string;
  description: string;
  skillsRequired: string[];
  duration: '1 day' | '3 days' | '1 week' | '2 weeks';
  posterId: string;
  posterName?: string;
  companyName?: string;
  acceptanceCriteria?: string[];
  stipendOrPerks?: string;
  reward?: string;
  _id?: string;
}): Promise<any> {
  const { isConnected } = await connectToDatabase();
  const taskPayload = {
    title: data.title,
    description: data.description,
    skillsRequired: data.skillsRequired,
    duration: data.duration,
    posterId: data.posterId,
    posterName: data.posterName || 'Priya Sharma',
    companyName: data.companyName || 'DevStudio',
    acceptanceCriteria: data.acceptanceCriteria || [],
    stipendOrPerks: data.stipendOrPerks || data.reward || 'Verified Skill Badge',
    reward: data.stipendOrPerks || data.reward || 'Verified Skill Badge',
    status: 'open' as const,
  };

  if (isConnected) {
    await ensureSeeded();
    const doc = await Task.create(taskPayload);
    return doc.toObject();
  }

  const newTask: any = {
    _id: data._id || 'task_' + Date.now(),
    ...taskPayload,
    createdAt: new Date().toISOString(),
  };
  mem.tasks.unshift(newTask);
  return newTask;
}

// Submission methods
export async function getSubmissions(filters?: { posterId?: string; studentId?: string; taskId?: string }): Promise<any[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const query: any = {};
    if (filters?.taskId && mongoose.Types.ObjectId.isValid(filters.taskId)) {
      query.taskId = filters.taskId;
    }
    if (filters?.studentId && mongoose.Types.ObjectId.isValid(filters.studentId)) {
      query.studentId = filters.studentId;
    }

    let subs = await Submission.find(query)
      .populate('taskId')
      .populate('studentId', 'name email college avatar bio skills')
      .sort({ createdAt: -1 })
      .lean();

    if (filters?.posterId) {
      subs = subs.filter((s: any) => s.taskId && String(s.taskId.posterId) === String(filters.posterId));
    }

    return subs.map((s: any) => ({
      ...s,
      task: s.taskId,
      student: s.studentId,
    }));
  }

  // Memory fallback
  let list = [...mem.submissions];
  if (filters?.taskId) {
    list = list.filter((s) => s.taskId === filters.taskId);
  }
  if (filters?.studentId) {
    list = list.filter((s) => s.studentId === filters.studentId);
  }

  const enriched = list.map((s) => {
    const task = mem.tasks.find((t) => t._id === s.taskId);
    const student = mem.users.find((u) => u._id === s.studentId);
    return {
      ...s,
      task,
      student,
    };
  });

  if (filters?.posterId) {
    return enriched.filter((s) => s.task && s.task.posterId === filters.posterId);
  }

  return enriched;
}

export async function createSubmission(data: {
  taskId: string;
  studentId: string;
  proofUrl: string;
  notes?: string;
}): Promise<any> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const doc = await Submission.create({
      taskId: new mongoose.Types.ObjectId(data.taskId),
      studentId: new mongoose.Types.ObjectId(data.studentId),
      proofUrl: data.proofUrl,
      notes: data.notes || '',
      status: 'pending',
    });
    return doc.toObject();
  }

  const newSub: MockSubmission = {
    _id: 'sub_' + Date.now(),
    taskId: data.taskId,
    studentId: data.studentId,
    proofUrl: data.proofUrl,
    notes: data.notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  mem.submissions.unshift(newSub);
  return newSub;
}

export async function updateSubmissionStatus(
  submissionId: string,
  status: 'approved' | 'rejected',
  feedback?: string,
  issuerId?: string
): Promise<any> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const sub = await Submission.findByIdAndUpdate(
      submissionId,
      { status, feedback: feedback || '', reviewedAt: new Date() },
      { new: true }
    )
      .populate('taskId')
      .populate('studentId')
      .lean();

    if (sub && status === 'approved') {
      const task: any = sub.taskId;
      const primarySkill = task?.skillsRequired?.[0] || 'Technical Skill';
      await Badge.create({
        title: `${task?.title || 'Micro-Task'} Verified Badge`,
        skill: primarySkill,
        taskId: task?._id || sub.taskId,
        studentId: (sub.studentId as any)?._id || sub.studentId,
        issuerId: issuerId ? new mongoose.Types.ObjectId(issuerId) : undefined,
        issuedAt: new Date(),
      });
    }
    return sub;
  }

  // In-memory fallback
  const subIndex = mem.submissions.findIndex((s) => s._id === submissionId);
  if (subIndex === -1) return null;

  mem.submissions[subIndex].status = status;
  mem.submissions[subIndex].feedback = feedback || '';
  mem.submissions[subIndex].reviewedAt = new Date().toISOString();

  const sub = mem.submissions[subIndex];
  if (status === 'approved') {
    const task = mem.tasks.find((t) => t._id === sub.taskId);
    const primarySkill = task?.skillsRequired?.[0] || 'Technical Skill';
    const newBadge: MockBadge = {
      _id: 'badge_' + Date.now(),
      title: `${task?.title || 'Micro-Task'} Verified Badge`,
      skill: primarySkill,
      taskId: sub.taskId,
      studentId: sub.studentId,
      issuerId: issuerId,
      issuedAt: new Date().toISOString(),
    };
    mem.badges.unshift(newBadge);
  }

  return sub;
}

// Badge methods
export async function getBadges(studentId?: string): Promise<any[]> {
  const { isConnected } = await connectToDatabase();
  if (isConnected) {
    await ensureSeeded();
    const query: any = {};
    if (studentId && mongoose.Types.ObjectId.isValid(studentId)) {
      query.studentId = studentId;
    }
    return await Badge.find(query).populate('taskId', 'title duration').sort({ issuedAt: -1 }).lean();
  }

  let list = [...mem.badges];
  if (studentId) {
    list = list.filter((b) => b.studentId === studentId);
  }
  return list.map((b) => {
    const task = mem.tasks.find((t) => t._id === b.taskId);
    return {
      ...b,
      task: task ? { title: task.title, duration: task.duration } : undefined,
    };
  });
}
