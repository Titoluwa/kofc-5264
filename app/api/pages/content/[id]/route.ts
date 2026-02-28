import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pageContent = await prisma.pageContent.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!pageContent) {
      return NextResponse.json({ error: 'PageContent not found' }, { status: 404 });
    }

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error('Failed to fetch page Content:', error);
    return NextResponse.json({ error: 'Failed to fetch page Content' }, { status: 500 });
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
    const { pageId, name, image, mainText, subtext1, subtext2, subtext3, lists, primaryButton, secondaryButton } = await request.json();

    const pageContent = await prisma.pageContent.update({
      where: { id: Number.parseInt(id) },
      data: {
        pageId: pageId === undefined ? undefined : pageId,
        name: name === undefined ? undefined : name,
        image: image === undefined ? undefined : image,
        mainText: mainText === undefined ? undefined : mainText,
        subtext1: subtext1 === undefined ? undefined : subtext1,
        subtext2: subtext2 === undefined ? undefined : subtext2,
        subtext3: subtext3 === undefined ? undefined : subtext3,
        lists: lists === undefined ? undefined : lists,
        primaryButton: primaryButton === undefined ? undefined : primaryButton,
        secondaryButton: secondaryButton === undefined ? undefined : secondaryButton,
      },
    });

    return NextResponse.json(pageContent);
  } catch (error) {
    console.error('Failed to update pageContent:', error);
    return NextResponse.json({ error: 'Failed to update pageContent' }, { status: 500 });
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
    await prisma.pageContent.delete({
      where: { id: Number.parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete pageContent:', error);
    return NextResponse.json({ error: 'Failed to delete pageContent' }, { status: 500 });
  }
}
