import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { updateSubmissionStatus } from '@/lib/store';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { status, feedback } = body;

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Status must be 'approved' or 'rejected'" }, { status: 400 });
    }

    const issuerId = session?.user ? (session.user as any).id : (body.issuerId || 'company-1');
    const issuerName = session?.user?.name || body.issuerName || 'Priya Sharma';
    const companyName = (session?.user as any)?.company || body.companyName || 'DevStudio';

    const updated = await updateSubmissionStatus(params.id, status, feedback, {
      issuerId,
      issuerName,
      companyName,
    });
    if (!updated) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      submission: updated,
      message: status === 'approved' ? 'Submission approved and verified badge issued!' : 'Submission rejected with feedback',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
