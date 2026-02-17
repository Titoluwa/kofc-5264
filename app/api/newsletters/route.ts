import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const newsletters = await prisma.newsletter.findMany({
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(newsletters);
  } catch (error) {
    console.error('Failed to fetch newsletters:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletters' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subject, content, sentDate } = await request.json();

    if (!subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        subject,
        content,
        sentDate: sentDate ? new Date(sentDate) : null,
        createdBy: user.userId,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error) {
    console.error('Failed to create newsletter:', error);
    return NextResponse.json({ error: 'Failed to create newsletter' }, { status: 500 });
  }
}
