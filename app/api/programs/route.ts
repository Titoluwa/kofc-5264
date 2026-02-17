import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Failed to fetch programs:', error);
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, icon, content, order } = await request.json();

    if (!title || !description || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const program = await prisma.program.create({
      data: {
        title,
        description,
        icon: icon || null,
        content,
        order: order || 0,
        createdBy: user.userId,
      },
      include: {
        creator: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error('Failed to create program:', error);
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}
