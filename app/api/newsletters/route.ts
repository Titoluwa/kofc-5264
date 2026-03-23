import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { sendNewsletterToSubscribers, scheduleNewsletterEmail } from '@/lib/email';

export async function GET() {
  try {
    const newsletters = await prisma.newsletter.findMany({
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

    const { title, subtitle, description, category, content, publishedDate, heroImage } =
      await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    let resolvedPublishedDate: Date | null | undefined;
    if (publishedDate === undefined) {
      resolvedPublishedDate = undefined;
    } else {
      resolvedPublishedDate = publishedDate ? new Date(publishedDate) : null;
    }

    const newsletter = await prisma.newsletter.create({
      data: {
        title,
        subtitle,
        description,
        category,
        content,
        publishedDate: resolvedPublishedDate,
        heroImage,
      },
    });

    const now = new Date();
    const isFuture =
      resolvedPublishedDate instanceof Date && resolvedPublishedDate.getTime() > now.getTime();

    if (isFuture) {
      scheduleNewsletterEmail(newsletter, resolvedPublishedDate as Date);
    } else {
      sendNewsletterToSubscribers(newsletter).catch((err) =>
        console.error('[email] Background send failed:', err),
      );
    }

    return NextResponse.json(newsletter, { status: 201 });
  } catch (error) {
    console.error('Failed to create newsletter:', error);
    return NextResponse.json({ error: 'Failed to create newsletter' }, { status: 500 });
  }
}