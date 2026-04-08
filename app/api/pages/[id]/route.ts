
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH( request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const pageId = Number.parseInt(id);
    if (Number.isNaN(pageId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const { slug, name, navbar } = await request.json();

    const page = await prisma.page.update({
      where: { id: pageId },
      data: {
        ...(slug && { slug }),
        ...(name && { name }),
        ...(navbar !== undefined && { navbar }),
      },
      include: { contents: true },
    });

    return NextResponse.json(page);
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error('Failed to update page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE( _req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const pageId = Number.parseInt(id);
    if (Number.isNaN(pageId)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    await prisma.page.delete({ where: { id: pageId } });
    

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }
    console.error('Failed to delete page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = Number.parseInt(id);
  
  try {

    const { name } = await request.json();

    if (Number.isNaN(pageId)) return NextResponse.json({ error: 'Invalid page ID' }, { status: 400 });

    const content = await prisma.pageContent.findFirst({ where: { pageId, name } });

    if (!content) return NextResponse.json({ error: 'Content not found' }, { status: 404 });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Failed to get content:', error);
    return NextResponse.json({ error: 'Failed to get section' }, { status: 500 });
  }
}