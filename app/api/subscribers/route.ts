import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { subscribedAt: 'desc' },
    });

    return NextResponse.json(subscribers);
  } catch (error) {
    console.error('Failed to fetch subscribers:', error);
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If unsubscribed, resubscribe
      if (!existingSubscriber.isActive) {
        const updated = await prisma.newsletterSubscriber.update({
          where: { email },
          data: {
            isActive: true,
            unsubscribedAt: null,
          },
        });
        return NextResponse.json(updated, { status: 200 });
      }
      // Already subscribed
      return NextResponse.json(existingSubscriber, { status: 200 });
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
      },
    });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    console.error('Failed to subscribe:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
