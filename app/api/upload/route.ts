// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { getCurrentUser } from '@/lib/auth';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']);

export async function POST(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
        }

        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            return NextResponse.json({ error: `File too large. Max size is ${MAX_SIZE_MB}MB.` }, { status: 400 });
        }

        // Ensure upload directory exists
        if (!existsSync(UPLOAD_DIR)) {
            await mkdir(UPLOAD_DIR, { recursive: true });
        }

        // Generate a unique filename to avoid collisions
        const ext = path.extname(file.name);
        const baseName = path.basename(file.name, ext).replaceAll(/[^a-z0-9]/gi, '-').toLowerCase();
        const uniqueName = `${baseName}-${Date.now()}${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        // Return the public URL path
        const url = `/uploads/${uniqueName}`;
        return NextResponse.json({ url }, { status: 201 });
    } catch (error) {
        console.error('Upload failed:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}