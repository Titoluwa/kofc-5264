import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if subscriber already exists
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { message: 'Already subscribed', status: 'already_subscribed' },
          { status: 200 }
        );
      }
      // Reactivate subscription
      const reactivated = await prisma.newsletterSubscriber.update({
        where: { email },
        data: {
          isActive: true,
          unsubscribedAt: null,
        },
      });
      return NextResponse.json(
        { message: 'Resubscribed successfully', status: 'resubscribed', subscriber: reactivated },
        { status: 200 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.newsletterSubscriber.create({
      data: {
        email,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: 'Subscribed successfully', status: 'subscribed', subscriber },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
