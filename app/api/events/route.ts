import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
        // include: {
        //     creator: {
        //     select: { name: true, email: true },
        //     },
        // },
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

        const { title, description, datetime, location, images, category} = await request.json();

        if (!title || !description || !datetime) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await prisma.event.create({
        data: {
            name: title,
            category,
            description,
            date: new Date(datetime),
            location: location || '',
            images  : images || null,
            // createdBy: user.userId,
        },
        // include: {
        //     creator: {
        //     select: { name: true, email: true },
        //     },
        // },
        });

        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error('Failed to create event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}
