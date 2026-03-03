// import { NextRequest, NextResponse } from 'next/server';
// import { prisma } from '@/lib/db';
// import { getCurrentUser } from '@/lib/auth';

// export async function GET() {
//   try {
//     const pages = await prisma.page.findMany({
//       include: {
//         contents: true,
//       },
//     });

//     return NextResponse.json(pages);
//   } catch (error) {
//     console.error('Failed to fetch pages:', error);
//     return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const user = await getCurrentUser();
//     if (!user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const { slug, title, content, navbar } = await request.json();

//     if (!slug || !title || !content) {
//       return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
//     }

//     const page = await prisma.page.create({
//       data: {
//         slug,
//         name: title,
//         contents: content,
//         navbar: navbar,
//       },
//     });

//     return NextResponse.json(page, { status: 201 });
//   } catch (error) {
//     console.error('Failed to create page:', error);
//     return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const pages = await prisma.page.findMany({
      include: { contents: true },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug, name, navbar } = await request.json();

    if (!slug || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const page = await prisma.page.create({
      data: { slug, name, navbar: navbar ?? false },
      include: { contents: true },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 });
    }
    console.error('Failed to create page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}