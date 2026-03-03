import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function POST( request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  console.log("params",params);
  const { id } = await params;
  const pageId = Number.parseInt(id);
  
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    if (Number.isNaN(pageId)) return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });

    const { name, image, mainText, subtext1, subtext2, subtext3, lists, primaryButton, secondaryButton } = await request.json();

    if (!name) return NextResponse.json({ error: 'Section name is required' }, { status: 400 });

    const content = await prisma.pageContent.create({
      data: {
        pageId,
        name,
        image: image || null,
        mainText: mainText || null,
        subtext1: subtext1 || null,
        subtext2: subtext2 || null,
        subtext3: subtext3 || null,
        lists: lists ?? [],
        primaryButton: primaryButton ?? undefined,
        secondaryButton: secondaryButton ?? undefined,
      },
    });

    return NextResponse.json(content, { status: 201 });
  } catch (error) {
    console.error('Failed to create content:', error);
    return NextResponse.json({ error: 'Failed to create section' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = Number.parseInt(id);

  if (Number.isNaN(pageId)) {
    return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });
  }

  try {
    const name = request.nextUrl.searchParams.get('name') ?? undefined;

    const content = await prisma.pageContent.findFirst({
      where: { pageId, ...(name && { name }) },
    });

    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json({ error: 'Failed to get section' }, { status: 500 });
  }
}