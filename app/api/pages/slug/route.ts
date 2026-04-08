import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const slug = request.nextUrl.searchParams.get('slug');

        if (!slug) {
            return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
        }

        const page = await prisma.page.findUnique({
            where: { slug },
            include: { contents: true },
        });

        if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

        return NextResponse.json(page);
    } catch (error) {
        console.error('Failed to get page:', error);
        return NextResponse.json({ error: 'Failed to get page' }, { status: 500 });
    }
}