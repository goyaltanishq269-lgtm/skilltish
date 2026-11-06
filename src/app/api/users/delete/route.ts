import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectToDatabase from '@/lib/mongodb';
import { User, Task, Submission, Badge } from '@/models';
import { deleteUserAccountFromStore } from '@/lib/store';

export async function DELETE() {
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

    // 2. Protect Platform Architect / Founder
    if (
      sessionEmail === 'goyaltanishq269@gmail.com' ||
      sessionUserId === 'founder' ||
      (session.user as any).role === 'founder'
    ) {
      return NextResponse.json(
        { success: false, error: 'Platform architect and founder account cannot be deleted.' },
        { status: 403 }
      );
    }

    // 3. Establish database connection
    const { isConnected } = await connectToDatabase();

    let targetUser: any = null;

    if (isConnected) {
      // Locate the target user document by email using User model
      targetUser = await User.findOne({ email: sessionEmail });

      // Fallback: search by id if email lookup did not match
      if (!targetUser && sessionUserId) {
        targetUser = await User.findById(sessionUserId).catch(() => null);
      }
    }

    // 4. Fallback check in memory store if not found in MongoDB
    if (!targetUser) {
      const memUser = global.memoryStore?.users.find(
        (u) =>
          u.email.toLowerCase() === sessionEmail ||
          (sessionUserId && String(u._id) === String(sessionUserId))
      );

      if (!memUser && !isConnected) {
        return NextResponse.json(
          { success: false, error: 'Account not found or already deleted.' },
          { status: 404 }
        );
      }

      if (memUser) {
        const memId = String(memUser._id);
        await deleteUserAccountFromStore(memId, sessionEmail);
        return NextResponse.json(
          {
            success: true,
            message: 'Account deleted successfully.',
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Account not found or already deleted.' },
        { status: 404 }
      );
    }

    const userId = String(targetUser._id);

    // 5. Perform cascading cleanup in MongoDB:
    if (isConnected) {
      // a. Remove submissions associated with the student
      await Submission.deleteMany({
        $or: [
          { studentId: userId },
          { studentId: sessionUserId },
          { studentId: sessionEmail },
        ],
      });

      // b. Remove or clean up tasks posted by the user/company
      await Task.deleteMany({
        $or: [
          { postedBy: userId },
          { posterId: userId },
          { posterId: sessionUserId },
          { posterId: sessionEmail },
          { creatorId: userId },
          { creatorId: sessionUserId },
          { creatorEmail: sessionEmail },
        ],
      });

      // c. Remove badges awarded to or issued by the user
      await Badge.deleteMany({
        $or: [
          { studentId: userId },
          { studentId: sessionUserId },
          { studentId: sessionEmail },
          { issuerId: userId },
          { issuerId: sessionUserId },
        ],
      });

      // d. Delete the user record
      await User.findByIdAndDelete(userId);
      if (sessionUserId && sessionUserId !== userId) {
        await User.findByIdAndDelete(sessionUserId).catch(() => null);
      }
      await User.deleteMany({ email: sessionEmail });
    }

    // 6. Synchronize in-memory fallback store
    await deleteUserAccountFromStore(userId, sessionEmail);
    if (sessionUserId && sessionUserId !== userId) {
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
    console.error('[API /api/users/delete] Error during account deletion:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'An unexpected error occurred while deleting the account.',
      },
      { status: 500 }
    );
  }
}
