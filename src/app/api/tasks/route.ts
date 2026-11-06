import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Task } from '@/models/Task';
import { getTasks, createTask } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const duration = searchParams.get('duration');
    const statusParam = searchParams.get('status');
    const search = searchParams.get('search');
    const creatorId = searchParams.get('creatorId');
    const creatorEmail = searchParams.get('creatorEmail');

    // Build filter query
    const query: any = {};

    // status defaults to 'open' if omitted or empty
    if (!statusParam) {
      query.status = 'open';
    } else if (statusParam !== 'all') {
      query.status = statusParam;
    }

    if (duration && duration !== 'all') {
      query.duration = duration;
    }

    if (skill && skill !== 'all') {
      query.skillsRequired = { $in: [new RegExp(skill, 'i')] };
    }

    if (creatorId || creatorEmail) {
      const orList: any[] = [];
      if (creatorId) {
        orList.push({ posterId: creatorId });
        orList.push({ creatorId: creatorId });
        if (
          creatorId === 'founder' ||
          creatorId === 'creator' ||
          creatorId === 'tanishq' ||
          creatorId === 'tanishq-goyal'
        ) {
          orList.push({ creatorEmail: 'goyaltanishq269@gmail.com' });
        }
      }
      if (creatorEmail) {
        orList.push({ creatorEmail: creatorEmail.toLowerCase() });
        orList.push({ 'poster.email': creatorEmail.toLowerCase() });
      }
      query.$or = orList;
    }

    if (search && search.trim()) {
      const s = search.trim();
      const searchOr = [
        { title: { $regex: s, $options: 'i' } },
        { description: { $regex: s, $options: 'i' } },
        { companyName: { $regex: s, $options: 'i' } },
      ];
      query.$and = [{ $or: searchOr }];
    }

    // Connect to DB and fetch sorted by createdAt: -1
    try {
      await connectDB();
      const tasks = await Task.find(query).sort({ createdAt: -1 }).lean();
      return NextResponse.json(tasks);
    } catch (dbErr: any) {
      console.warn(
        '[Tasks API GET]: MongoDB unavailable, querying fallback store:',
        dbErr.message
      );
      const fallbackTasks = await getTasks({
        duration: duration || undefined,
        skill: skill || undefined,
        search: search || undefined,
        creatorId: creatorId || undefined,
        creatorEmail: creatorEmail || undefined,
        status: statusParam || undefined,
      });
      return NextResponse.json(fallbackTasks);
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error while fetching tasks.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    // Reject with 401 if unauthenticated or if session.user.role !== 'company'
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized: You must be signed in to post a micro-task.' },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    const userEmail = ((session.user as any).email || '').toLowerCase();
    const isFounder =
      userRole === 'founder' ||
      userEmail === 'goyaltanishq269@gmail.com' ||
      userEmail === 'founder@skilltish.io';

    if (userRole !== 'company' && !isFounder) {
      return NextResponse.json(
        { error: 'Forbidden: Only company accounts and platform architects have permission to post challenges.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      skillsRequired,
      duration,
      acceptanceCriteria,
      stipendOrPerks,
    } = body;

    // Validation: Title
    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json(
        { error: 'Task title is required.' },
        { status: 400 }
      );
    }
    if (title.trim().length > 120) {
      return NextResponse.json(
        { error: 'Task title cannot exceed 120 characters.' },
        { status: 400 }
      );
    }

    // Validation: Description
    if (!description || typeof description !== 'string' || !description.trim()) {
      return NextResponse.json(
        { error: 'Task description is required.' },
        { status: 400 }
      );
    }

    // Validation: Skills
    let normalizedSkills: string[] = [];
    if (Array.isArray(skillsRequired)) {
      normalizedSkills = skillsRequired.map((s) => String(s).trim()).filter(Boolean);
    } else if (typeof skillsRequired === 'string') {
      normalizedSkills = skillsRequired.split(',').map((s) => s.trim()).filter(Boolean);
    }

    if (normalizedSkills.length === 0) {
      return NextResponse.json(
        { error: 'At least one required skill must be specified.' },
        { status: 400 }
      );
    }

    // Validation & Normalization: Duration
    const validDurations = ['1 day', '3 days', '1 week', '2 weeks'];
    const chosenDuration =
      duration && validDurations.includes(duration) ? duration : '3 days';

    // Normalization: Acceptance Criteria
    let normalizedCriteria: string[] = [];
    if (Array.isArray(acceptanceCriteria)) {
      normalizedCriteria = acceptanceCriteria.map((c) => String(c).trim()).filter(Boolean);
    } else if (typeof acceptanceCriteria === 'string') {
      normalizedCriteria = acceptanceCriteria
        .split('\n')
        .map((line) => line.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);
    }

    const finalStipendOrPerks =
      typeof stipendOrPerks === 'string' && stipendOrPerks.trim()
        ? stipendOrPerks.trim()
        : 'Verified Skill Badge';

    const posterId = session.user.id || (isFounder ? 'founder' : 'company-1');
    const posterName = session.user.name || (isFounder ? 'Tanishq Goyal' : 'Priya Sharma');
    const companyName = session.user.company || (isFounder ? 'SkillTish Architecture' : 'DevStudio');

    // Difficulty inference if not passed
    const rawDifficulty = body.difficulty;
    const computedDifficulty =
      rawDifficulty ||
      (chosenDuration === '1 day'
        ? 'Beginner'
        : chosenDuration === '1 week' || chosenDuration === '2 weeks'
        ? 'Advanced'
        : 'Intermediate');

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      acceptanceCriteria: normalizedCriteria,
      skillsRequired: normalizedSkills,
      duration: chosenDuration,
      stipendOrPerks: finalStipendOrPerks,
      reward: finalStipendOrPerks,
      posterId,
      posterName,
      companyName,
      creatorId: posterId,
      creatorEmail: session.user.email || (isFounder ? 'goyaltanishq269@gmail.com' : undefined),
      difficulty: computedDifficulty,
      status: 'open' as const,
      createdAt: new Date(),
    };

    // Save new task into MongoDB with posterId, posterName, and companyName
    try {
      await connectDB();
      const newTask = await Task.create(taskData);
      return NextResponse.json(newTask, { status: 201 });
    } catch (dbErr: any) {
      console.warn(
        '[Tasks API POST]: MongoDB write failed or offline, persisting in store fallback:',
        dbErr.message
      );
      const fallbackTask = await createTask({
        ...taskData,
        _id: 'task_' + Date.now(),
      } as any);
      return NextResponse.json(fallbackTask, { status: 201 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error while creating task.' },
      { status: 500 }
    );
  }
}
