import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const gallery = await prisma.gallery.findUnique({
      where: { id: Number.parseInt(id) },
    });

    if (!gallery) {
      return NextResponse.json({ error: 'gallery not found' }, { status: 404 });
    }

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Failed to fetch gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
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
    const { title, description, category, year, images, heroImage } = await request.json();

    const gallery = await prisma.gallery.update({
      where: { id: Number.parseInt(id) },
      data: {
        title: title === undefined ? undefined : title,
        description: description === undefined ? undefined : description,
        category: category === undefined ? undefined : category,
        year: year === undefined ? undefined : year,
        images: images === undefined ? undefined : images,
        heroImage: heroImage === undefined ? undefined : heroImage,
      }
    });

    return NextResponse.json(gallery);
  } catch (error) {
    console.error('Failed to update gallery:', error);
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
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
    await prisma.gallery.delete({
      where: { id: Number.parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete gallery:', error);
    return NextResponse.json({ error: 'Failed to delete gallery' }, { status: 500 });
  }
}
