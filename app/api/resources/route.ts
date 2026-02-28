import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error('Failed to fetch resources:', error);
    return NextResponse.json({ error: 'Failed to fetch resources' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, category, url, content, file } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description,
        category,
        url: url || null,
        content: content || null,
        file: file || null,
      },
    });

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error('Failed to create resource:', error);
    return NextResponse.json({ error: 'Failed to create resource' }, { status: 500 });
  }
}
