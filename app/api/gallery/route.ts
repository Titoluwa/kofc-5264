import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const gallerys = await prisma.gallery.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(gallerys);
  } catch (error) {
    console.error('Failed to fetch gallerys:', error);
    return NextResponse.json({ error: 'Failed to fetch gallerys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, icon, content, category, year } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const gallery = await prisma.gallery.create({
      data: {
        title,
        description,
        heroImage: icon,
        images: content,
        category,
        year,
      },
    });

    return NextResponse.json(gallery, { status: 201 });
  } catch (error) {
    console.error('Failed to create gallery:', error);
    return NextResponse.json({ error: 'Failed to create gallery' }, { status: 500 });
  }
}
