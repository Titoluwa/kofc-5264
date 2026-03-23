// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getCurrentUser } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE_MB = 5;

const ALLOWED_TYPES = {
  image: new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']),
  document: new Set([
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/zip',
  ]),
  any: null, // null = no restriction
} satisfies Record<string, Set<string> | null>;

type UploadCategory = keyof typeof ALLOWED_TYPES;

function isValidCategory(value: unknown): value is UploadCategory {
  return typeof value === 'string' && value in ALLOWED_TYPES;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await request.formData();

    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const rawCategory = formData.get('category');
    const category: UploadCategory = isValidCategory(rawCategory) ? rawCategory : 'any';
    const allowedSet = ALLOWED_TYPES[category];

    if (allowedSet !== null && !allowedSet.has(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type for category "${category}".` },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large. Max size is ${MAX_SIZE_MB} MB.` },
        { status: 400 },
      );
    }

    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true });
    }

    const ext = path.extname(file.name);
    const base = path.basename(file.name, ext).replaceAll(/[^a-z0-9]/gi, '-').toLowerCase();
    const uniqueName = `${base}-${Date.now()}${ext}`;
    const filePath = path.join(UPLOAD_DIR, uniqueName);

    await writeFile(filePath, Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({ url: `/uploads/${uniqueName}` }, { status: 201 });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}