import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const newsletter = await prisma.newsletter.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!newsletter) {
      return NextResponse.json({ error: 'Newsletter not found' }, { status: 404 });
    }

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Failed to fetch newsletter:', error);
    return NextResponse.json({ error: 'Failed to fetch newsletter' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { title, subtitle, description, category, content, publishedDate } = await request.json();

    let resolvedPublishedDate: Date | null | undefined;
    if (publishedDate === undefined) {
      resolvedPublishedDate = undefined;
    } else {
      resolvedPublishedDate = publishedDate ? new Date(publishedDate) : null;
    }

    const newsletter = await prisma.newsletter.update({
      where: { id: Number.parseInt(id) },
      data: {
        title: title === undefined ? undefined : title,
        subtitle: subtitle === undefined ? undefined : subtitle,
        description: description === undefined ? undefined : description,
        category: category === undefined ? undefined : category,
        content: content === undefined ? undefined : content,
        publishedDate: resolvedPublishedDate,
      },
    });

    return NextResponse.json(newsletter);
  } catch (error) {
    console.error('Failed to update newsletter:', error);
    return NextResponse.json({ error: 'Failed to update newsletter' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await prisma.newsletter.delete({
      where: { id: Number.parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete newsletter:', error);
    return NextResponse.json({ error: 'Failed to delete newsletter' }, { status: 500 });
  }
}
