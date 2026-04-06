import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'desc' },
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
        if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { title, description, datetime, location, image, images, category, content, schedule, allowRegistration, allowVolunteer, notificationEmail} = await request.json();

        if (!title || !description || !datetime) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await prisma.event.create({
        data: {
            name: title === undefined ? undefined : title,
            description: description === undefined ? undefined : description,
            category: category === undefined ? undefined : category,
            content: content === undefined ? undefined : content,
            schedule: schedule === undefined ? undefined : schedule,
            date: datetime === undefined ? undefined : new Date(datetime),
            location: location === undefined ? undefined : location,
            images: images === undefined ? undefined : images,
            image: image === undefined ? undefined : image,
            allowRegistration: allowRegistration === undefined ? undefined : allowRegistration,
            allowVolunteer: allowVolunteer === undefined ? undefined : allowVolunteer,
            notificationEmail: notificationEmail === undefined ? undefined : notificationEmail,
        },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Failed to create event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
