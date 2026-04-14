import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error('Failed to fetch events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { title, description, datetime, location, image, images, category, content, schedule, allowRegistration, allowVolunteer, notificationEmail, volunteersToken } = await request.json();

        if (!title || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                name: title,
                description,
                category: category ?? 'other',
                content: content ?? null,
                schedule: schedule ?? null,
                date: datetime ? new Date(datetime) : null,
                location: location ?? null,
                images: images ?? null,
                image: image ?? null,
                allowRegistration: allowRegistration ?? false,
                allowVolunteer: allowVolunteer ?? false,
                notificationEmail: notificationEmail ?? null,
                volunteersToken: volunteersToken ?? null,
            },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Failed to create event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
