import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { User, Task, Submission, Badge } from '@/models';
import {
  getUserById,
  getBadges,
  getSubmissions,
  deleteUserAccountFromStore,
} from '@/lib/store';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const badges = (await getBadges(params.id)) ?? [];
    const allSubmissions = (await getSubmissions({ studentId: params.id })) ?? [];
    const approvedSubmissions = (allSubmissions ?? []).filter((s) => s?.status === 'approved');

    return NextResponse.json({
      user,
      badges,
      completedTasks: approvedSubmissions,
      allSubmissionsCount: allSubmissions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Authenticate caller via NextAuth session
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. You must be signed in to delete an account.' },
        { status: 401 }
      );
    }

    const sessionEmail = session.user.email.trim().toLowerCase();
    const sessionUserId = String(session.user.id || (session.user as any)._id || '').trim();
    const targetParamId = String(params.id || '').trim();

    // 2. Protect Platform Architect / Founder
    if (
      targetParamId === 'founder' ||
      targetParamId === 'tanishq' ||
      sessionEmail === 'goyaltanishq269@gmail.com' ||
      sessionUserId === 'founder' ||
      (session.user as any).role === 'founder'
    ) {
      return NextResponse.json(
        { success: false, error: 'Platform architect and founder account cannot be deleted.' },
        { status: 403 }
      );
    }

    // 3. Resolve target user to verify caller owns this account
    const targetUser = await getUserById(targetParamId);

    const targetUserId = String(targetUser?._id || targetUser?.id || targetParamId).trim();
    const targetUserEmail = String(targetUser?.email || '').trim().toLowerCase();

    const isMatch =
      (sessionUserId && sessionUserId === targetUserId) ||
      (sessionEmail && sessionEmail === targetUserEmail) ||
      (sessionUserId && sessionUserId === targetParamId) ||
      (sessionEmail && sessionEmail === targetParamId.toLowerCase());

    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. You can only delete your own account.' },
        { status: 403 }
      );
    }

    // 4. Perform cascading cleanup in MongoDB
    const { isConnected } = await connectToDatabase();
    if (isConnected) {
      await Submission.deleteMany({
        $or: [
          { studentId: targetUserId },
          { studentId: sessionUserId },
          { studentId: sessionEmail },
          ...(targetUserEmail ? [{ studentId: targetUserEmail }] : []),
        ],
      });

      await Task.deleteMany({
        $or: [
          { postedBy: targetUserId },
          { posterId: targetUserId },
          { posterId: sessionUserId },
          { posterId: sessionEmail },
          { creatorId: targetUserId },
          { creatorId: sessionUserId },
          { creatorEmail: sessionEmail },
          ...(targetUserEmail ? [{ creatorEmail: targetUserEmail }] : []),
        ],
      });

      await Badge.deleteMany({
        $or: [
          { studentId: targetUserId },
          { studentId: sessionUserId },
          { studentId: sessionEmail },
          { issuerId: targetUserId },
          { issuerId: sessionUserId },
          ...(targetUserEmail ? [{ studentId: targetUserEmail }] : []),
        ],
      });

      await User.deleteMany({
        $or: [
          { _id: targetUserId },
          { _id: sessionUserId },
          { email: sessionEmail },
          ...(targetUserEmail ? [{ email: targetUserEmail }] : []),
        ],
      });
    }

    // 5. Synchronize in-memory fallback store
    await deleteUserAccountFromStore(targetUserId, targetUserEmail || sessionEmail);
    if (sessionUserId && sessionUserId !== targetUserId) {
      await deleteUserAccountFromStore(sessionUserId, sessionEmail);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Account deleted successfully.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[API /api/users/[id]] Error during account deletion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while deleting the account.',
      },
      { status: 500 }
    );
  }
}
