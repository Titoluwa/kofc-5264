import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
  const { contentId } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const contentIdNum = Number.parseInt(contentId);
        if (Number.isNaN(contentIdNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        const { name, image, mainText, subtext1, subtext2, subtext3, lists, primaryButton, secondaryButton } = await request.json();

        const content = await prisma.pageContent.update({
            where: { id: contentIdNum },
            data: {
                ...(name && { name }),
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

        return NextResponse.json(content);
    } catch (error: any) {
        if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        console.error('Failed to update content:', error);
        return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
    }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; contentId: string }> }
) {
    const { contentId } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const contentIdNum = Number.parseInt(contentId);
        if (Number.isNaN(contentIdNum)) return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

        await prisma.pageContent.delete({ where: { id: contentIdNum } });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        console.error('Failed to delete content:', error);
        return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
    }
}