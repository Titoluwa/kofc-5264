import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
    try {
        const pageContents = await prisma.pageContent.findMany({
            orderBy: { id: 'desc' },
            include: {
                page: true,
            },
        });

        return NextResponse.json(pageContents);
    } catch (error) {
        console.error('Failed to fetch page contents:', error);
        return NextResponse.json({ error: 'Failed to fetch page contents' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { pageId, name, image, mainText, subtext1, subtext2, subtext3, lists, primaryButton, secondaryButton } = await request.json();

        if (!pageId || !name || !mainText) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const page = await prisma.pageContent.create({
            data: {
                pageId,
                name,
                image,
                mainText,
                subtext1,
                subtext2,
                subtext3,
                lists,
                primaryButton,
                secondaryButton,
            },
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Failed to create page:', error);
        return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }
}
